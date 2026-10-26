# WELSTAND® Wellness — Static Website

A premium, responsive, build-free website for WELSTAND® Wellness, Kota, Rajasthan.

## Run locally
Open `index.html` in any modern browser. No build step or server is required.

## Files
- `index.html` — all sections and content
- `style.css` — design system (CSS custom properties at the top)
- `script.js` — navigation, WhatsApp enquiry logic, form validation, FAQ, lightbox, reveal animations
- `assets/images/` — images (see `ASSET-MANIFEST.md`)
- `assets/icons/README.md` — icon notes

## How WhatsApp enquiries work
- Each "Enquire Now" button calls the service enquiry function in `script.js` and opens `https://wa.me/919887047862` with a prefilled message naming the service.
- The enquiry form validates the input, builds a readable message, URL-encodes it and opens WhatsApp.
- **The customer must press Send in WhatsApp.** A website without a backend cannot send messages silently or store enquiries. For that, add a separate backend integration (for example the WhatsApp Business API or a form service).
- If the browser blocks the new window, the form keeps its data and shows a manual "Tap here to open WhatsApp" link.

## Customisation
- **Colours / fonts:** edit the `:root` variables in `style.css`.
- **WhatsApp number:** change `WHATSAPP_NUMBER` in `script.js`, and the `wa.me` / `tel:` links and JSON-LD in `index.html`.
- **Services:** copy a `<article class="service-card">` block, set `data-service`, and add a matching `<option>` in the form.
- **Pricing:** none is shown. Replace the "Contact us for pricing" lines only with real, approved prices.
- **Testimonials:** only add real, approved customer feedback. The section currently shows the verified 4.6 / 108 rating and a link to Google Maps reviews.
- **Canonical URL:** a commented-out `<link rel="canonical">` sits in `<head>`. Uncomment it and set your real domain after publishing. Also add `og:url` and `og:image` then.
- **Social links:** none are included because no URLs were supplied.

## Business facts used
Rating 4.6/5 (108 reviews), phone/WhatsApp +91 98870 47862, address as supplied, "open until 8:00 PM" as listed. No opening time, coordinates, prices or social profiles were invented.
