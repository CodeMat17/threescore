/**
 * Decorative background texture.
 *
 * The ~1.5kb SVG data-URI used to be inlined in a `style` attribute, so it was
 * re-sent in the HTML of every page. It now lives in a CSS class defined once
 * in `globals.css` and is cached with the stylesheet.
 */
export default function CulturalPattern() {
  return <div aria-hidden className='cultural-pattern' />;
}
