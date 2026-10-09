import { config, fields, collection, singleton } from '@keystatic/core';

const img = (label: string) =>
  fields.image({ label, directory: 'public/images/projects', publicPath: '/images/projects/' });
const text = (label: string, description?: string) =>
  fields.text({ label, multiline: true, description });
const sketchbookItem = fields.object({
  image: fields.image({ label: 'Image', directory: 'public/images/sketchbook', publicPath: '/images/sketchbook/' }),
  caption: fields.text({ label: 'Caption (e.g. Title, 2022)', description: 'Leave empty for no caption.' }),
});
const formatting ='Use **double asterisks** for bold. Leave a blank line between paragraphs. Start lines with "1." for a numbered list or "- " for bullets.';

// Every section has a short name for the sidebar plus a label and heading.
const sectionBasics = {
  navLabel: fields.text({ label: 'Name in sidebar', description: 'Leave empty to keep it out of the sidebar.' }),
  label: fields.text({ label: 'Small label above the heading (e.g. CONTEXT)' }),
  heading: fields.text({ label: 'Heading' }),
};

// The building blocks a case study page is made of, in any order.
const caseStudySections = fields.blocks(
  {
    textWithImages: {
      label: 'Text with images beside it',
      schema: fields.object({
        ...sectionBasics,
        body: text('Text', formatting),
        images: fields.array(img('Image'), { label: 'Images (shown side by side, right)' }),
        bigImages: fields.checkbox({ label: 'Large images (narrow text column, text centered)', defaultValue: false }),
      }),
    },
    mediaText: {
      label: 'One image beside text',
      schema: fields.object({
        ...sectionBasics,
        intro: text('Intro text above (optional)', formatting),
        body: text('Text beside the image', formatting),
        image: img('Image'),
        imageLeft: fields.checkbox({ label: 'Image on the left (text on the right)', defaultValue: false }),
      }),
    },
    cards: {
      label: 'Row of cards',
      schema: fields.object({
        ...sectionBasics,
        intro: text('Intro text', formatting),
        tinted: fields.checkbox({ label: 'Green tinted cards without images', defaultValue: false }),
        cards: fields.array(
          fields.object({ image: img('Image'), title: fields.text({ label: 'Title' }), text: text('Text') }),
          { label: 'Cards', itemLabel: (p) => p.fields.title.value },
        ),
      }),
    },
    callout: {
      label: 'Callout box',
      schema: fields.object({
        label: fields.text({ label: 'Small label (e.g. PROBLEM STATEMENT)' }),
        text: text('Text', formatting),
        serif: fields.checkbox({ label: 'Use the serif heading font', defaultValue: false }),
      }),
    },
    text: {
      label: 'Text only',
      schema: fields.object({ ...sectionBasics, body: text('Text', formatting), wide: fields.checkbox({ label: 'Full width text', defaultValue: false }) }),
    },
    images: {
      label: 'Row of images',
      schema: fields.object({
        images: fields.array(
          fields.object({
            image: img('Image'),
            width: fields.integer({ label: 'Relative width', description: 'e.g. 3 and 2 makes the first image wider.', defaultValue: 1 }),
          }),
          { label: 'Images' },
        ),
      }),
    },
    stats: {
      label: 'Research with stats',
      schema: fields.object({
        ...sectionBasics,
        intro: text('Intro text', formatting),
        image: img('Image'),
        stats: fields.array(
          fields.object({
            value: fields.text({ label: 'Number (e.g. 80%)' }),
            line: fields.text({ label: 'Main line' }),
            detail: text('Grey detail'),
            quote: text('Quote under this stat (optional)'),
          }),
          { label: 'Stats', itemLabel: (p) => `${p.fields.value.value} ${p.fields.line.value}` },
        ),
        quote: text('Quote in black box'),
        imageRight: fields.checkbox({ label: 'Put the image on the right', defaultValue: false }),
      }),
    },
    features: {
      label: 'Feature cards with a tall image',
      schema: fields.object({
        ...sectionBasics,
        intro: text('Intro text', formatting),
        items: fields.array(
          fields.object({ title: fields.text({ label: 'Title' }), text: text('Text') }),
          { label: 'Features', itemLabel: (p) => p.fields.title.value },
        ),
        image: img('Tall image beside the cards'),
      }),
    },
    accordion: {
      label: 'Drop-down list with an image',
      schema: fields.object({
        ...sectionBasics,
        intro: text('Intro text (optional)', formatting),
        dark: fields.checkbox({ label: 'Black background', defaultValue: true }),
        items: fields.array(
          fields.object({
            title: fields.text({ label: 'Bold label (e.g. Form)' }),
            subtitle: fields.text({ label: 'Line after the label (e.g. harmless at first glance)' }),
            body: text('Text shown when opened', formatting),
            image: img('Image shown while this one is open (optional)'),
            video: fields.file({
              label: 'Video shown while this one is open (optional, plays muted on loop; .mp4)',
              directory: 'public/images/projects',
              publicPath: '/images/projects/',
            }),
            floats: fields.array(
              fields.object({
                image: img('Floating image (e.g. a cut-out screenshot)'),
                left: fields.number({ label: 'Left edge (% of the box width)', defaultValue: 0 }),
                top: fields.number({ label: 'Top edge (% of the box height)', defaultValue: 0 }),
                width: fields.number({ label: 'Width (% of the box width)', defaultValue: 30 }),
              }),
              { label: 'Floating layers over the image (they drift gently)', itemLabel: (p) => p.fields.image.value?.filename ?? 'Layer' },
            ),
            framing: fields.integer({
              label: 'Video/image framing (0 = show the top, 100 = show the bottom)',
              defaultValue: 50,
              validation: { min: 0, max: 100 },
            }),
          }),
          { label: 'Drop-downs', itemLabel: (p) => `${p.fields.title.value}: ${p.fields.subtitle.value}` },
        ),
        image: img('Default image'),
      }),
    },
    nextSteps: {
      label: 'Metrics table and next steps',
      schema: fields.object({
        ...sectionBasics,
        intro: text('Text above the table', formatting),
        tableHeadA: fields.text({ label: 'First column heading', defaultValue: 'Metric' }),
        tableHeadB: fields.text({ label: 'Second column heading', defaultValue: 'Why it matters' }),
        rows: fields.array(
          fields.object({ a: fields.text({ label: 'First column' }), b: fields.text({ label: 'Second column' }) }),
          { label: 'Table rows', itemLabel: (p) => p.fields.a.value },
        ),
        sideTitle: fields.text({ label: 'Right column title' }),
        sideBody: text('Right column text', formatting),
      }),
    },
    textAndImage: {
      label: 'Text with one large image',
      schema: fields.object({ ...sectionBasics, body: text('Text', formatting), image: img('Image') }),
    },
    decisions: {
      label: 'Design decisions (two images + text per row)',
      schema: fields.object({
        ...sectionBasics,
        rows: fields.array(
          fields.object({ imageA: img('First image'), imageB: img('Second image'), title: fields.text({ label: 'Title' }), text: text('Text') }),
          { label: 'Rows', itemLabel: (p) => p.fields.title.value },
        ),
      }),
    },
  },
  { label: 'Case study sections' },
);


export default config({
  storage: { kind: 'local' },
  ui: { brand: { name: "chloe's portfolio" } },
  singletons: {
    navigation: singleton({
      label: 'Navigation',
      path: 'src/content/navigation',
      format: { data: 'yaml' },
      schema: {
        siteName: fields.text({ label: 'Name at the top', defaultValue: 'Chloe Jung' }),
        panelLabel: fields.text({ label: 'Panel label', defaultValue: 'Navigation' }),
        homeLabel: fields.text({ label: 'Home link', defaultValue: 'Home' }),
        projectsLabel: fields.text({ label: 'Projects link', defaultValue: 'Projects' }),
        sketchbookLabel: fields.text({ label: 'Sketchbook link', defaultValue: 'Sketchbook' }),
        aboutLabel: fields.text({ label: 'About link', defaultValue: 'About Me' }),
      },
    }),
    footer: singleton({
      label: 'Footer',
      path: 'src/content/footer',
      format: { data: 'yaml' },
      schema: {
        heading: fields.text({ label: 'Heading', defaultValue: 'Curious about anything? Let’s talk!' }),
        email: fields.text({ label: 'Email address', description: 'Leave empty to hide the link.' }),
        emailLabel: fields.text({ label: 'Email link text', defaultValue: 'Email' }),
        linkedinUrl: fields.url({ label: 'LinkedIn URL', description: 'Leave empty to hide the link.' }),
        linkedinLabel: fields.text({ label: 'LinkedIn link text', defaultValue: 'LinkedIn' }),
        copyright: fields.text({ label: 'Copyright line', defaultValue: '© Chloe Jung 2026' }),
      },
    }),
    sketchbook: singleton({
      label: 'Sketchbook page',
      path: 'src/content/pages/sketchbook',
      format: { data: 'yaml' },
      schema: {
        heading: fields.text({ label: 'Heading', defaultValue: 'Sketchbook' }),
        intro: fields.text({ label: 'Intro', multiline: true }),
        galleries: fields.blocks(
          {
            strip: {
              label: 'Strip (one piece, photos side by side at equal height)',
              schema: fields.array(sketchbookItem, { label: 'Photos', itemLabel: (p) => p.fields.caption.value || 'Photo' }),
            },
            masonry: {
              label: 'Masonry (two columns, caption under each)',
              schema: fields.array(sketchbookItem, { label: 'Pieces', itemLabel: (p) => p.fields.caption.value || 'Piece' }),
            },
          },
          { label: 'Galleries' },
        ),
      },
    }),
    about: singleton({
      label: 'About Me page',
      path: 'src/content/pages/about',
      format: { data: 'yaml' },
      schema: {
        heading: fields.text({ label: 'Heading', defaultValue: 'About Me' }),
        intro: fields.text({ label: 'Intro', multiline: true }),
      },
    }),
    home: singleton({
      label: 'Home page',
      path: 'src/content/home',
      format: { data: 'yaml' },
      schema: {
        greeting: fields.text({ label: 'Big greeting', defaultValue: "hello! i’m chloe" }),
        tagline: fields.text({
          label: 'Tagline',
          description: 'Wrap a word in *asterisks* to make it italic.',
          multiline: true,
        }),
        subtitle: fields.text({ label: 'Subtitle (grey text)', multiline: true }),
        scrollPrompt: fields.text({ label: 'Scroll prompt', multiline: true }),
        projectsHeading: fields.text({ label: 'Projects heading', defaultValue: 'Projects' }),
      },
    }),
  },
  collections: {
    projects: collection({
      label: 'Projects',
      slugField: 'title',
      path: 'src/content/projects/*',
      format: { data: 'yaml' },
      columns: ['title', 'year'],
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        order: fields.integer({
          label: 'Order on home page',
          description: 'Lower numbers show first.',
          defaultValue: 1,
        }),
        cover: fields.image({
          label: 'Cover image',
          directory: 'public/images/projects',
          publicPath: '/images/projects/',
        }),
        description: fields.text({ label: 'One-line description' }),
        tags: fields.array(fields.text({ label: 'Tag' }), {
          label: 'Tags',
          itemLabel: (props) => props.value,
        }),
        year: fields.text({ label: 'Year' }),
        hidden: fields.checkbox({ label: 'Hide from home page', defaultValue: false }),
        caseStudy: fields.object(
          {
            enabled: fields.checkbox({ label: 'This project has its own page', defaultValue: false }),
            accent: fields.text({ label: 'Accent color (labels, tag text)', defaultValue: '#175c35' }),
            tint: fields.text({ label: 'Tint color (tags, callouts, cards)', defaultValue: '#d5eade' }),
            hero: img('Big image at the top'),
            headline: fields.text({ label: 'Page title' }),
            summary: text('Summary under the title', formatting),
            role: text('Role (one per line)'),
            team: text('Team (one per line)'),
            timeline: text('Timeline'),
            skills: text('Skills (one per line)'),
            sections: caseStudySections,
          },
          { label: 'Project page' },
        ),
      },
    }),
  },
});
