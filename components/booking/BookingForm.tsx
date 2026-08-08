"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FieldError } from "@/components/ui/field-error";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  SelectContent,
  SelectItem,
  Select as SelectRoot,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/convex/_generated/api";
import {
  fieldProps,
  toNumber,
  validate,
  validators,
  type FieldErrors,
} from "@/lib/validation";
import { useMutation } from "convex/react";
import { ChevronDownIcon, Loader2 } from "lucide-react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { DateRange } from "react-day-picker";
import { toast } from "sonner";

// react-day-picker is ~40kb and only needed once the date popover opens.
const Calendar = dynamic(
  () => import("@/components/ui/calendar").then((m) => m.Calendar),
  {
    ssr: false,
    loading: () => (
      <div className='h-72 w-[20rem] animate-pulse rounded-lg bg-muted' />
    ),
  }
);

type BookingValues = {
  fullName: string;
  email: string;
  phone: string;
  nationality: string;
  passport: string;
  rooms: number;
  adults: number;
  teens: number;
  kids: number;
  comments: string;
};

const ROOM_TYPES = [
  { value: "single", label: "Single" },
  { value: "double", label: "Double" },
  { value: "twin", label: "Twin" },
  { value: "family", label: "Family" },
];

const MEAL_PLANS = [
  { value: "bb", label: "Bed & Breakfast" },
  { value: "half-board", label: "Half-board" },
  { value: "full-board", label: "Full-board" },
  { value: "all-inclusive", label: "All-inclusive" },
];

const RULES = {
  fullName: [
    validators.required("Full name"),
    validators.minLength(2, "Full name"),
  ],
  email: [validators.required("Email"), validators.email],
  phone: [validators.required("Phone number"), validators.phone],
  rooms: [validators.range(1, 30, "Rooms")],
  adults: [validators.range(1, 40, "Adults")],
  teens: [validators.range(0, 40, "Teens")],
  kids: [validators.range(0, 40, "Children")],
  comments: [validators.maxLength(2000, "Notes")],
} as const;

export default function BookingForm({
  pkg,
  priceFromUsd,
}: {
  pkg: string;
  priceFromUsd?: number;
}) {
  const [values, setValues] = useState<BookingValues>({
    fullName: "",
    email: "",
    phone: "",
    nationality: "",
    passport: "",
    rooms: 1,
    adults: 2,
    teens: 0,
    kids: 0,
    comments: "",
  });
  const [date, setDate] = useState<DateRange | undefined>();
  const [roomType, setRoomType] = useState("double");
  const [mealPlan, setMealPlan] = useState("full-board");
  const [errors, setErrors] = useState<
    FieldErrors<BookingValues> & { date?: string }
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(false);

  const addBooking = useMutation(api.bookings.addBookings);
  const router = useRouter();

  const set = <K extends keyof BookingValues>(
    key: K,
    value: BookingValues[K]
  ) => {
    setValues((v) => ({ ...v, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const formatDate = (d?: Date) =>
    d
      ? d.toLocaleDateString(undefined, {
          year: "numeric",
          month: "short",
          day: "2-digit",
        })
      : "";

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    const found: FieldErrors<BookingValues> & { date?: string } = validate(
      values,
      RULES as never
    );

    if (!date?.from || !date?.to) {
      found.date = "Select both a start and an end date";
    } else if (date.to <= date.from) {
      found.date = "The return date must be after the departure date";
    } else if (date.from < new Date(new Date().toDateString())) {
      found.date = "The departure date can't be in the past";
    }

    // Cross-field: you cannot put more travellers in fewer rooms than allowed.
    const guests = values.adults + values.teens + values.kids;
    if (!found.rooms && guests > values.rooms * 4) {
      found.rooms = `${guests} travellers need at least ${Math.ceil(guests / 4)} rooms`;
    }

    setErrors(found);
    if (Object.keys(found).length > 0) {
      const firstKey = Object.keys(found)[0];
      document.getElementById(firstKey)?.focus();
      toast.error("Please check the highlighted fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      await addBooking({
        packageTitle: pkg,
        priceFromUsd,
        fullName: values.fullName.trim(),
        email: values.email.trim(),
        phone: values.phone.trim(),
        nationality: values.nationality.trim() || undefined,
        passport: values.passport.trim() || undefined,
        fromDate: date!.from!.getTime(),
        toDate: date!.to!.getTime(),
        rooms: values.rooms,
        roomType,
        mealPlan,
        travelers: {
          adults: values.adults,
          teens: values.teens,
          kids: values.kids,
        },
        comments: values.comments.trim() || undefined,
      });
      router.push(
        `/thank-you?name=${encodeURIComponent(values.fullName.trim())}`
      );
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit booking. Please try again.");
      setIsSubmitting(false);
    }
  };

  /** Numeric field: an emptied input no longer submits NaN. */
  const numberField = (
    key: "rooms" | "adults" | "teens" | "kids",
    label: string,
    min: number
  ) => (
    <div>
      <Label htmlFor={key} requiredMark={min > 0}>
        {label}
      </Label>
      <Input
        {...fieldProps(key, errors[key])}
        type='number'
        inputMode='numeric'
        min={min}
        max={40}
        value={values[key]}
        onChange={(e) => set(key, toNumber(e.target.value, min))}
        className='mt-1.5'
        required={min > 0}
      />
      <FieldError id={key} message={errors[key]} />
    </div>
  );

  return (
    <Card>
      <form onSubmit={onSubmit} noValidate>
        <CardHeader>
          <CardTitle>Booking details</CardTitle>
          {/* CardDescription renders a <p>; the previous version nested a
              <Label> and another <p> inside it, producing invalid HTML. */}
          <CardDescription>
            {pkg}
            {typeof priceFromUsd === "number" &&
              ` — from $${priceFromUsd.toLocaleString("en-US")} per person`}
          </CardDescription>
        </CardHeader>

        <CardContent className='space-y-8'>
          <fieldset className='space-y-5'>
            <legend className='text-sm font-semibold'>Who&apos;s booking</legend>
            <div className='grid gap-5 md:grid-cols-2'>
              <div>
                <Label htmlFor='fullName' requiredMark>
                  Full name
                </Label>
                <Input
                  {...fieldProps("fullName", errors.fullName)}
                  autoComplete='name'
                  placeholder='Jane Doe'
                  value={values.fullName}
                  onChange={(e) => set("fullName", e.target.value)}
                  className='mt-1.5'
                  required
                />
                <FieldError id='fullName' message={errors.fullName} />
              </div>

              <div>
                <Label htmlFor='email' requiredMark>
                  Email
                </Label>
                <Input
                  {...fieldProps("email", errors.email)}
                  type='email'
                  inputMode='email'
                  autoComplete='email'
                  placeholder='you@example.com'
                  value={values.email}
                  onChange={(e) => set("email", e.target.value)}
                  className='mt-1.5'
                  required
                />
                <FieldError id='email' message={errors.email} />
              </div>

              <div>
                <Label htmlFor='phone' requiredMark>
                  Phone number
                </Label>
                <Input
                  {...fieldProps("phone", errors.phone)}
                  type='tel'
                  inputMode='tel'
                  autoComplete='tel'
                  placeholder='+254 700 000 000'
                  value={values.phone}
                  onChange={(e) => set("phone", e.target.value)}
                  className='mt-1.5'
                  required
                />
                <FieldError id='phone' message={errors.phone} />
              </div>

              <div>
                <Label htmlFor='nationality'>Nationality</Label>
                <Input
                  id='nationality'
                  autoComplete='country-name'
                  placeholder='Country of citizenship'
                  value={values.nationality}
                  onChange={(e) => set("nationality", e.target.value)}
                  className='mt-1.5'
                />
              </div>

              <div className='md:col-span-2'>
                <Label htmlFor='passport'>Passport number (if applicable)</Label>
                <Input
                  id='passport'
                  placeholder='XXXXXXXX'
                  value={values.passport}
                  onChange={(e) => set("passport", e.target.value)}
                  className='mt-1.5'
                />
              </div>
            </div>
          </fieldset>

          <fieldset className='space-y-5'>
            <legend className='text-sm font-semibold'>Travel dates</legend>
            <div className='max-w-md'>
              <Label htmlFor='date' requiredMark>
                Departure — return
              </Label>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    type='button'
                    variant='outline'
                    id='date'
                    aria-invalid={errors.date ? true : undefined}
                    aria-describedby={errors.date ? "date-error" : undefined}
                    className='mt-1.5 w-full justify-between font-normal'>
                    {date?.from
                      ? `${formatDate(date.from)}${date.to ? ` — ${formatDate(date.to)}` : ""}`
                      : "Select dates"}
                    <ChevronDownIcon aria-hidden />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className='w-auto overflow-hidden p-0'>
                  <Calendar
                    mode='range'
                    defaultMonth={date?.from ?? new Date()}
                    numberOfMonths={1}
                    selected={date}
                    disabled={{ before: new Date() }}
                    captionLayout='dropdown'
                    onSelect={(range) => {
                      setDate(range);
                      setErrors((e) => ({ ...e, date: undefined }));
                    }}
                    className='rounded-lg border shadow-sm'
                  />
                </PopoverContent>
              </Popover>
              <FieldError id='date' message={errors.date} />
            </div>
          </fieldset>

          <fieldset className='space-y-5'>
            <legend className='text-sm font-semibold'>
              Travellers and rooms
            </legend>
            <div className='grid gap-5 sm:grid-cols-3'>
              {numberField("adults", "Adults", 1)}
              {numberField("teens", "Teens", 0)}
              {numberField("kids", "Children", 0)}
            </div>

            <div className='grid gap-5 sm:grid-cols-3'>
              {numberField("rooms", "Rooms", 1)}

              <div>
                {/* These Selects previously had a bare <Label> with no
                    `htmlFor`, leaving them with no accessible name at all. */}
                <Label htmlFor='roomType'>Room type</Label>
                <SelectRoot value={roomType} onValueChange={setRoomType}>
                  <SelectTrigger id='roomType' className='mt-1.5 w-full'>
                    <SelectValue placeholder='Select room type' />
                  </SelectTrigger>
                  <SelectContent>
                    {ROOM_TYPES.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </SelectRoot>
              </div>

              <div>
                <Label htmlFor='mealPlan'>Meal plan</Label>
                <SelectRoot value={mealPlan} onValueChange={setMealPlan}>
                  <SelectTrigger id='mealPlan' className='mt-1.5 w-full'>
                    <SelectValue placeholder='Select meal plan' />
                  </SelectTrigger>
                  <SelectContent>
                    {MEAL_PLANS.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </SelectRoot>
              </div>
            </div>
          </fieldset>

          <div>
            <Label htmlFor='comments'>Special requests or notes</Label>
            <Textarea
              {...fieldProps("comments", errors.comments)}
              rows={4}
              placeholder='Dietary needs, accessibility, celebrations, etc.'
              value={values.comments}
              onChange={(e) => set("comments", e.target.value)}
              className='mt-1.5'
            />
            <FieldError id='comments' message={errors.comments} />
          </div>

          <div className='flex flex-wrap gap-3'>
            <Button
              type='submit'
              size='lg'
              variant='brand'
              disabled={isSubmitting}>
              {isSubmitting && <Loader2 className='animate-spin' aria-hidden />}
              {isSubmitting ? "Submitting…" : "Confirm booking"}
            </Button>
            <Button
              type='button'
              size='lg'
              variant='outline'
              onClick={() => router.back()}>
              Cancel
            </Button>
          </div>
        </CardContent>
      </form>
    </Card>
  );
}
