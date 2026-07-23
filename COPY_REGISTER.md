# Copy Register — javiport

> Source of truth for **every visible string** on the site, EN + ES, voiced for Javi.
> Reflow agents: use these strings verbatim. Do not improvise copy unless a slot is explicitly marked TBD.
> Voice notes at the bottom — read them before adding/editing copy.

> **Font substitution note**: the display face is **Literata** (Stitch substituted from the originally-specified Fraunces — composition is tuned to it). Any inline reference below to "Fraunces" should be read as **Literata**. This supersedes contradicting references.

---

## 1. Brand strings (same in both languages)

| Slot | Value |
|---|---|
| Full name | Javier Lanz Bethencourt |
| Short name | Javier Lanz |
| Location | Caracas, Venezuela |
| Year (footer) | 2026 |
| Email | javielanz@gmail.com |
| Phone (display) | +58 424 233 4996 |
| Phone (WhatsApp link) | https://wa.me/584242334996 |
| LinkedIn | https://www.linkedin.com/in/javierlanzb |
| Instagram | https://www.instagram.com/javilanzb |
| Instagram handle (display) | @javilanzb |
| LinkedIn handle (display) | /in/javierlanzb |

---

## 2. Hero

| Slot | EN | ES |
|---|---|---|
| Eyebrow (mono, uppercase, tracking-wider) | `CONTENT STRATEGIST · CARACAS, 2026` | `CONTENT STRATEGIST · CARACAS, 2026` |
| Display name (kinetic type, display-xl Fraunces) | `Javier Lanz Bethencourt` | `Javier Lanz Bethencourt` |
| Tagline (display-md Fraunces, muted) | `Content strategy that turns attention into customers.` | `Estrategia de contenido que convierte atención en clientes.` |
| Availability line (mono, accent) | `Available for commercial & marketing internships · 2026` | `Disponible para pasantías comerciales y de marketing · 2026` |
| CV link (secondary, ghost button) | `Download CV (PDF)` → `/CV_Javier_Lanz_2026_EN.pdf` | `Descargar CV (PDF)` → `/CV_Javier_Lanz_2026_ES.pdf` |
| Scroll cue (mono, caption) | `Scroll` | `Desliza` |

**Kinetic type note for agents**: the name reveals word-by-word per §7 of PLAN.md. Word boundaries: `Javier` · `Lanz` · `Bethencourt`. Stagger 60 ms.

---

## 3. Navigation

| Position | EN | ES |
|---|---|---|
| Nav item 1 | About | Sobre Mí |
| Nav item 2 | Work | Proyectos |
| Nav item 3 | Capabilities | Capacidades |
| Nav item 4 | Experience | Experiencia |
| Nav item 5 | Education | Educación |
| Nav item 6 | Contact | Contacto |
| Lang toggle label (current) | EN | ES |
| Lang toggle label (target) | ES | EN |
| Lang toggle aria-label | Switch to Spanish | Cambiar a inglés |

**Anchor IDs** (shared, ungendered): `#about`, `#work`, `#capabilities`, `#experience`, `#education`, `#contact`.

---

## 4. About section

| Slot | EN | ES |
|---|---|---|
| Eyebrow | `ABOUT` | `SOBRE MÍ` |
| Headline (display-lg) | `Strategy at 24 frames per second.` | `Estrategia a 24 cuadros por segundo.` |
| Body paragraph 1 | I'm a Social Communication student at Universidad Monteávila and Content Strategist at EGCars, where I collaborate on the launch of Suzuki in Venezuela. My focus is client acquisition — prospecting, pitching new accounts, and lead-generation content — supported by AI tools to produce high-volume, on-brand work. | Soy estudiante de Comunicación Social en la Universidad Monteávila y Content Strategist en EGCars, donde colaboro en el lanzamiento de Suzuki en Venezuela. Mi foco es la captación de clientes — prospección, pitches a cuentas nuevas y contenido de generación de leads — apoyado en herramientas de IA para producir contenido de alto volumen alineado a la marca. |
| Body paragraph 2 | Outside work I direct music videos, do street journalism in Caracas, and study how creators like Nolan build loyal audiences. Those interests train the narrative eye I bring to every campaign. | Fuera del trabajo dirijo videoclips, hago periodismo de calle en Caracas y estudio cómo creadores como Nolan construyen audiencias leales. Esos intereses entrenan el ojo narrativo que traigo a cada campaña. |
| Fact line (mono, muted) | `B.A. in Social Communication (in progress) · Cambridge B2` | `Lic. en Comunicación Social (en curso) · Cambridge B2` |

---

## 5. Selected Work — section header

| Slot | EN | ES |
|---|---|---|
| Eyebrow | `SELECTED WORK` | `TRABAJO SELECCIONADO` |
| Headline (display-lg) | `Five pieces, one throughline.` | `Cinco piezas, un mismo hilo.` |
| Sub (muted body) | Strategy, story, image — sometimes all three at once. | Estrategia, narrativa, imagen — a veces los tres a la vez. |

### Work cards (display order matches the array)

#### Card 1 — `egcars-suzuki-launch`
| Slot | EN | ES |
|---|---|---|
| Tag | `2026 · STRATEGY` | `2026 · ESTRATEGIA` |
| Title | Launching Suzuki in Venezuela | Lanzando Suzuki en Venezuela |
| Summary | Content engine for a 3-person team standing up Suzuki's Venezuelan presence from zero. | Motor de contenido para un equipo de 3 lanzando la presencia venezolana de Suzuki desde cero. |
| CTA | See the work → | Ver el trabajo → |

#### Card 2 — `street-journalism`
| Slot | EN | ES |
|---|---|---|
| Tag | `2024 · JOURNALISM` | `2024 · PERIODISMO` |
| Title | Street Journalism | Periodismo de Calle |
| Summary | Interviewing strangers on the streets of Caracas — cold approaches, active listening, and field reporting, published as team pieces with a narrative angle. | Entrevistas a desconocidos en las calles de Caracas — abordaje en frío, escucha activa y levantamiento de información en campo, publicadas en equipo con enfoque narrativo. |
| CTA | Read the case → | Ver el caso → |

#### Card 3 — `caracas-photo-essay`
| Slot | EN | ES |
|---|---|---|
| Tag (mono eyebrow) | `2025 · PHOTOGRAPHY` | `2025 · FOTOGRAFÍA` |
| Title (display-md) | The Streets of Caracas | Las Calles de Caracas |
| Summary (body) | A documentary series on the city as it is, not as it's reported. | Una serie documental sobre la ciudad como es, no como se cuenta. |
| CTA microcopy (link label) | View essay → | Ver ensayo → |

#### Card 4 — `nolan-cinematic-universe`
| Slot | EN | ES |
|---|---|---|
| Tag | `2024 · ESSAY` | `2024 · ENSAYO` |
| Title | The Cinematic Universe of Christopher Nolan | El Universo Cinematográfico de Christopher Nolan |
| Summary | Senior thesis on how Nolan's narrative architecture builds fan loyalty. | Tesis de bachillerato sobre cómo la arquitectura narrativa de Nolan construye lealtad. |
| CTA | Read thesis → | Leer tesis → |

#### Card 5 — `short-films`
| Slot | EN | ES |
|---|---|---|
| Tag | `2024–25 · DIRECTION & EDIT` | `2024–25 · DIRECCIÓN Y EDICIÓN` |
| Title | Short Films & Music Videos | Cortometrajes y Videoclips |
| Summary | Self-taught direction across documentary, music video, and photographic series. | Dirección autodidacta en documental, videoclip y series fotográficas. |
| CTA | Watch the reel → | Ver el reel → |

**Long-form case study body copy is intentionally NOT in this register** — flagged as a separate writing pass post-M9 per the conversation.

---

## 6. Capabilities

| Slot | EN | ES |
|---|---|---|
| Eyebrow | `CAPABILITIES` | `CAPACIDADES` |
| Headline (display-lg) | `Trained in story. Fluent in software.` | `Formado en narrativa. Fluido en software.` |

### Clusters (typographic treatment — see PLAN.md §4)

#### Cluster 1
| | EN | ES |
|---|---|---|
| Label | Commercial | Comercial |
| Skills | Lead generation. · Prospecting. · Pitches & proposals. · Client communication. · Excel. | Generación de leads. · Prospección. · Pitches y propuestas. · Comunicación con clientes. · Excel. |

#### Cluster 2
| | EN | ES |
|---|---|---|
| Label | Content & Creative | Contenido y Creatividad |
| Skills (comma list, display-md, line break per item) | Storytelling. · Copywriting. · Visual concept. · Brand positioning. · Editorial writing. | Storytelling. · Copywriting. · Concepto visual. · Posicionamiento de marca. · Escritura editorial. |

#### Cluster 3
| | EN | ES |
|---|---|---|
| Label | AI Tools | Herramientas de IA |
| Skills | Claude with MCP. · Midjourney. · DALL-E. · Generative copywriting. · Prompt engineering. | Claude con MCP. · Midjourney. · DALL-E. · Copywriting generativo. · Prompt engineering. |

#### Cluster 4
| | EN | ES |
|---|---|---|
| Label | Design & Editing | Diseño y Edición |
| Skills | Canva (advanced). · Capcut. · Photo & video editing. | Canva (avanzado). · Capcut. · Edición de foto y video. |

#### Cluster 5
| | EN | ES |
|---|---|---|
| Label | Productivity | Productividad |
| Skills | Microsoft Office. · Google Workspace. | Microsoft Office. · Google Workspace. |

---

## 7. Experience

| Slot | EN | ES |
|---|---|---|
| Eyebrow | `EXPERIENCE` | `EXPERIENCIA` |
| Headline (display-lg) | `Where the work happens.` | `Donde sucede el trabajo.` |

### Item 1 — EGCars
| Slot | EN | ES |
|---|---|---|
| Company | EGCars — Suzuki Importer, Venezuela | EGCars — Importadora Suzuki, Venezuela |
| Role | Content Strategist | Content Strategist |
| Dates (mono) | `2026 — Present` | `2026 — Presente` |
| Bullet 1 | Collaborating on a 3-person digital marketing initiative building a client-acquisition engine for the launch of Suzuki in Venezuela — the founding content function of an emerging marketing-agency model. | Colaborando en una iniciativa de marketing digital de 3 personas que construye un motor de captación de clientes para el lanzamiento de Suzuki en Venezuela — la función de contenido fundadora de un modelo emergente de agencia de marketing. |
| Bullet 2 | Preparing pitches and creative proposals to acquire and represent additional clients beyond the founding account. | Preparando pitches y propuestas creativas para captar y representar clientes adicionales más allá de la cuenta fundadora. |
| Bullet 3 | Developing content strategy across Instagram and TikTok to position the brand, generate awareness, and attract qualified leads. | Desarrollando estrategia de contenido en Instagram y TikTok para posicionar la marca, generar awareness y atraer leads calificados. |
| Bullet 4 | Designing creative concepts and visual assets with Canva, Capcut, and AI-assisted ideation (Midjourney, DALL-E) to produce high-volume, on-brand content. | Diseñando conceptos creativos y activos visuales con Canva, Capcut e ideación asistida por IA (Midjourney, DALL-E) para producir contenido de alto volumen alineado a la marca. |

---

## 8. Education

| Slot | EN | ES |
|---|---|---|
| Eyebrow | `EDUCATION` | `EDUCACIÓN` |
| Headline (display-lg) | `What shaped the eye.` | `Lo que formó la mirada.` |

### Item 1 — Universidad Monteávila
| Slot | EN | ES |
|---|---|---|
| Institution | Universidad Monteávila | Universidad Monteávila |
| Degree | B.A. in Social Communication | Lic. en Comunicación Social |
| Dates | 2024 — 2028 (expected) | 2024 — 2028 (en curso) |

> GPA removed 2026-07-23 per Javi — the CV does not show it; never reintroduce an academic index on the site.

### Item 2 — Colegio Los Arcos
| Slot | EN | ES |
|---|---|---|
| Institution | Colegio Los Arcos | Colegio Los Arcos |
| Degree | High School Diploma, Sciences | Bachiller en Ciencias |
| Dates | 2013–2024 | 2013–2024 |
| Highlight 1 | Senior Thesis: *The Cinematic Universe of Christopher Nolan* — analysis of narrative structures and pop-culture impact. | Tesis: *El Universo Cinematográfico de Christopher Nolan* — análisis de estructuras narrativas e impacto en la cultura pop. |
| Highlight 2 | Cambridge B2 English Certification. | Certificación de inglés Cambridge nivel B2. |

### Item 3 — Cambridge English
| Slot | EN | ES |
|---|---|---|
| Institution | Cambridge English | Cambridge English |
| Degree | B2 First Certificate in English | Certificación de Inglés Cambridge B2 |
| Dates | 2024 | 2024 |
| Meta line (mono, muted) | `English — Cambridge B2` | `Inglés — Cambridge B2` |

> Never pair "Advanced"/"Avanzado" with B2 — B2 is upper-intermediate. Label is exactly "English — Cambridge B2" / "Inglés — Cambridge B2".

---

## 9. Contact

| Slot | EN | ES |
|---|---|---|
| Eyebrow | `CONTACT` | `CONTACTO` |
| Headline (display-lg) | `Let's build something.` | `Construyamos algo.` |
| Body (one line, muted) | Open to commercial and marketing internships, freelance content work, and collaborations. | Abierto a pasantías comerciales y de marketing, freelance de contenido y colaboraciones. |
| CV button label (primary, filled accent) | Download CV (PDF) | Descargar CV (PDF) |
| CV button aria-label | Download Javier's CV as a PDF | Descargar el CV de Javier en PDF |
| CV file (per language, in /public/) | `/CV_Javier_Lanz_2026_EN.pdf` | `/CV_Javier_Lanz_2026_ES.pdf` |
| Email button label | Email | Correo |
| WhatsApp button label | WhatsApp | WhatsApp |
| LinkedIn button label | LinkedIn | LinkedIn |
| Instagram button label | Instagram | Instagram |
| Email button aria-label | Send Javier an email | Enviar correo a Javier |
| WhatsApp button aria-label | Message Javier on WhatsApp | Escribir a Javier por WhatsApp |
| Reply expectation (mono, subtle) | `Typically replies within 24h` | `Suele responder en 24h` |

---

## 10. Footer

| Slot | EN | ES |
|---|---|---|
| Credit line | © 2026 Javier Lanz Bethencourt · Caracas, Venezuela | © 2026 Javier Lanz Bethencourt · Caracas, Venezuela |
| Tech credit (mono, subtle, optional) | Built with Astro · Hosted on GitHub Pages | Construido con Astro · Hospedado en GitHub Pages |
| Lang switch link | Español | English |
| Back-to-top label | Back to top | Volver arriba |

---

## 11. 404 page

| Slot | EN | ES |
|---|---|---|
| Headline (display-lg) | Lost in the cut. | Perdido en el corte. |
| Body | This page is on the cutting-room floor. | Esta página quedó en la sala de edición. |
| CTA | Back to the reel → | Volver al inicio → |

---

## 12. Meta (per page)

### Home
| Field | EN | ES |
|---|---|---|
| `<title>` | Javier Lanz — Content Strategist & Storyteller | Javier Lanz — Estratega de Contenido y Narrador |
| `<meta description>` | Content Strategist at EGCars — Suzuki importer, Venezuela. Content strategy and client acquisition: prospecting, pitches, and lead-generation content. Available for commercial and marketing internships. | Content Strategist en EGCars — Importadora Suzuki, Venezuela. Estrategia de contenido y captación de clientes: prospección, pitches y contenido de generación de leads. Disponible para pasantías comerciales y de marketing. |
| OG title | Javier Lanz — Content Strategist & Storyteller | Javier Lanz — Estratega de Contenido y Narrador |
| OG description | Content strategy that turns attention into customers. | Estrategia de contenido que convierte atención en clientes. |
| OG image | `/og.png` (1200×630, shared) | `/og.png` (1200×630, shared) |

### Case studies (template — fill per slug)
| Field | Pattern (EN) | Pattern (ES) |
|---|---|---|
| `<title>` | `{Case Study Title} — Javier Lanz` | `{Título del Proyecto} — Javier Lanz` |
| `<meta description>` | Use the work card `Summary` from §5 | Use the work card `Summary` from §5 |
| OG image | `/og/{slug}-en.jpg` | `/og/{slug}-es.jpg` |

OG image: `/public/og.png` shipped 2026-07-23 (typographic, dark theme, shared across pages/languages). Per-slug OG images remain a possible follow-up.

---

## 13. Accessibility strings

| Slot | EN | ES |
|---|---|---|
| Skip link | Skip to main content | Saltar al contenido principal |
| External link suffix (sr-only) | (opens in new tab) | (abre en una pestaña nueva) |
| Image alt — Caracas essay cover 1 | A young person in denim walks past colored shutters and parked motorcycles on a Caracas street. | Una persona joven en denim camina junto a portones de colores y motos estacionadas en una calle de Caracas. |
| Image alt — Caracas essay cover 2 | A figure faces a turquoise shuttered facade between pink and yellow walls, hand raised. | Una figura frente a una fachada de portón turquesa entre paredes rosadas y amarillas, con la mano alzada. |
| Image alt — Caracas essay cover 3 | A person crosses an intersection in a hillside Caracas neighborhood under tangled power lines. | Una persona cruza una intersección en un barrio de colina en Caracas bajo cables enredados. |
| Particle field aria | Decorative animated background | Fondo animado decorativo |
| Particle field role | `presentation` (no semantic meaning) | `presentation` |

---

## 14. Loading / states

| Slot | EN | ES |
|---|---|---|
| Initial brand mark (during font load) | JAVIER LANZ | JAVIER LANZ |
| Generic loading (sr-only) | Loading | Cargando |
| Image failed-to-load alt | Image unavailable | Imagen no disponible |
| Video play prompt | Click to play | Clic para reproducir |
| Video mute label | Sound off — click to unmute | Sonido apagado — clic para activar |

---

## 15. Voice & tone notes

Read before adding or editing copy.

- **First person, present tense.** Javi speaks for himself.
- **Confident, never grandiose.** "I'm helping launch Suzuki" not "I am spearheading a transformational launch."
- **Cinema metaphors are okay — sparingly.** One per page max. Cut if it feels forced.
- **Bilingual parity, not literal translation.** ES should read like a Venezuelan wrote it, not like a translation of EN. If a phrase doesn't survive translation, change both sides until they feel native.
- **No regional slang.** Spanish should be neutral / Venezuelan-standard (tú, not vos). Avoid Argentinisms and Mexicanisms.
- **No emoji.** Anywhere on the site.
- **Sentence case for headlines.** Not Title Case. Periods are okay at end of display headlines for rhythm.
- **Mono / uppercase for eyebrows and meta lines.** Never for body copy.
- **No exclamation marks** except in 1–2 explicitly playful spots (currently zero).
- **Numbers as numerals.** "3-person team" not "three-person team." "24h" not "twenty-four hours."

### Forbidden words (cliché killers)

EN: "passionate", "innovative", "synergy", "leverage" (as verb), "ecosystem" (unless literally), "delve", "tapestry", "navigate" (as metaphor), "elevate", "unlock", "empower", "robust", "seamless", "curated" (overused), "journey".

ES: "apasionado/a", "innovador" (genérico), "sinergia", "aprovechar potencial", "ecosistema" (metafórico), "tejido" (metafórico), "navegar" (metafórico), "elevar", "desbloquear", "empoderar", "robusto", "sin fisuras", "curado" (sobreusado), "viaje" (metafórico).

---

*End of register. Updates land in the same file; PRs touching copy must update both languages.*
