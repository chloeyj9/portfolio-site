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
        bigImage: fields.checkbox({ label: 'Larger image (about half the width, text centered beside it)', defaultValue: false }),
        roleLabel: fields.text({ label: 'Outlined box label (optional, e.g. My Role)' }),
        role: fields.text({ label: 'Outlined box text (optional, shown bold under the text, lined up with the bottom of the image)', multiline: true }),
      }),
    },
    cards: {
      label: 'Row of cards',
      schema: fields.object({
        ...sectionBasics,
        intro: text('Intro text', formatting),
        tinted: fields.checkbox({ label: 'Green tinted cards without images', defaultValue: false }),
        narrowIntro: fields.checkbox({ label: 'Narrow intro text (about half width)', defaultValue: false }),
        cards: fields.array(
          fields.object({
            image: img('Image'),
            video: fields.file({
              label: 'Video instead of the image (optional, loops silently like a GIF; .mp4)',
              directory: 'public/images/projects',
              publicPath: '/images/projects/',
            }),
            title: fields.text({ label: 'Title' }),
            text: text('Text'),
          }),
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
      schema: fields.object({
        ...sectionBasics,
        body: text('Text', formatting),
        wide: fields.checkbox({ label: 'Full width text', defaultValue: false }),
        narrow: fields.checkbox({ label: 'Narrow text (about two-thirds width)', defaultValue: false }),
      }),
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
        crop: fields.checkbox({
          label: 'Same height, cropped to fill',
          description: 'Otherwise each image shows whole, at its own shape.',
          defaultValue: false,
        }),
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
        video: fields.file({
          label: 'Video beside the cards (optional, plays muted on loop; .mp4). Shown instead of the image.',
          directory: 'public/images/projects',
          publicPath: '/images/projects/',
        }),
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
    impact: {
      label: 'Impact numbers (boxes in a row)',
      schema: fields.object({
        navLabel: sectionBasics.navLabel,
        label: sectionBasics.label,
        items: fields.array(
          fields.object({ value: fields.text({ label: 'Number (e.g. 50+)' }), label: fields.text({ label: 'What it counts' }) }),
          { label: 'Boxes', itemLabel: (p) => `${p.fields.value.value} ${p.fields.label.value}` },
        ),
      }),
    },
    circles: {
      label: 'Circle images with text and a legend',
      schema: fields.object({
        ...sectionBasics,
        circles: fields.array(
          fields.object({ image: img('Image (cropped to a circle)'), label: fields.text({ label: 'Label under it' }) }),
          { label: 'Circles', itemLabel: (p) => p.fields.label.value },
        ),
        body: text('Text beside the circles', formatting),
        legend: fields.array(
          fields.object({
            color: fields.text({ label: 'Color (e.g. #a93f3c)' }),
            label: fields.text({ label: 'Label' }),
            outline: fields.checkbox({ label: 'Outline only', defaultValue: false }),
          }),
          { label: 'Legend', itemLabel: (p) => p.fields.label.value },
        ),
      }),
    },
    survey: {
      label: 'Survey findings in tabs, with an image',
      schema: fields.object({
        ...sectionBasics,
        body: text('Text above the tabs', formatting),
        tabs: fields.array(
          fields.object({
            name: fields.text({ label: 'Tab name' }),
            color: fields.text({ label: 'Color (e.g. #aa3f3c)', defaultValue: '#aa3f3c' }),
            quote: fields.text({ label: 'Quote in the colored bar' }),
            stats: fields.array(
              fields.object({ value: fields.text({ label: 'Number (e.g. 83%)' }), text: fields.text({ label: 'Text' }) }),
              { label: 'Stats', itemLabel: (p) => `${p.fields.value.value} ${p.fields.text.value}` },
            ),
            highlightLabel: fields.text({ label: 'Colored lead-in (e.g. Identified Retail Gaps:)' }),
            highlight: text('Text after the lead-in'),
            note: text('Grey note at the bottom'),
            chart: fields.object(
              {
                type: fields.select({
                  label: 'Chart type',
                  options: [
                    { label: 'Bar chart', value: 'bars' },
                    { label: 'Treemap (boxes sized by value)', value: 'treemap' },
                    { label: 'Pie chart (values are percentages)', value: 'pie' },
                  ],
                  defaultValue: 'bars',
                }),
                title: fields.text({ label: 'Chart title' }),
                axis: fields.text({ label: 'Axis label, bar charts only (e.g. # of Respondents)' }),
                color: fields.text({ label: 'Color', defaultValue: '#aa3f3c' }),
                bars: fields.array(
                  fields.object({
                    label: fields.text({ label: 'Label' }),
                    value: fields.number({ label: 'Value' }),
                    color: fields.text({ label: 'Own color (pie charts; optional, e.g. #778d48)' }),
                  }),
                  { label: 'Values (largest first)', itemLabel: (p) => `${p.fields.label.value}: ${p.fields.value.value ?? ''}` },
                ),
              },
              { label: 'Chart shown on the right while this tab is open' },
            ),
          }),
          { label: 'Tabs', itemLabel: (p) => p.fields.name.value },
        ),
        image: img('Image on the right (shown for tabs without a chart)'),
      }),
    },
    steps: {
      label: 'Step-by-step box (with a Next step button)',
      schema: fields.object({
        ...sectionBasics,
        steps: fields.array(
          fields.object({
            image: img('Image on the left'),
            label: fields.text({ label: 'Step label (e.g. Step 1: Traditional definition)' }),
            title: fields.text({ label: 'Big title (e.g. mews). Put *stars* around words to make them red italic.' }),
            titleImage: img('Image shown as the title instead (e.g. a logo)'),
            subtitle: fields.text({ label: 'Line under the title (e.g. /myo͞oz/)' }),
            body: text('Text (**bold** words show in red)', formatting),
            detailImage: img('Smaller image under the text (optional)'),
            detailCaption: text('Caption beside the smaller image'),
          }),
          { label: 'Steps', itemLabel: (p) => p.fields.label.value || 'Step' },
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
        projectsLabel: fields.text({ label: 'Work link', defaultValue: 'Work' }),
        sketchbookLabel: fields.text({ label: 'Studio link', defaultValue: 'My Studio' }),
        aboutLabel: fields.text({ label: 'About link', defaultValue: 'About Me' }),
      },
    }),
    footer: singleton({
      label: 'Footer',
      path: 'src/content/footer',
      format: { data: 'yaml' },
      schema: {
        heading: fields.text({ label: 'Heading', multiline: true, defaultValue: 'Curious about\nanything? Let’s chat!' }),
        email: fields.text({ label: 'Email address', description: 'Leave empty to hide the link.' }),
        emailLabel: fields.text({ label: 'Email link text', defaultValue: 'Email' }),
        linkedinUrl: fields.url({ label: 'LinkedIn URL', description: 'Leave empty to hide the link.' }),
        linkedinLabel: fields.text({ label: 'LinkedIn link text', defaultValue: 'LinkedIn' }),
        copyright: fields.text({ label: 'Copyright line', defaultValue: '© Chloe Jung 2026' }),
      },
    }),
    sketchbook: singleton({
      label: 'My Studio page',
      path: 'src/content/pages/sketchbook',
      format: { data: 'yaml' },
      schema: {
        heading: fields.text({ label: 'Heading', defaultValue: 'My Studio' }),
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
        heading: fields.text({ label: 'Heading', multiline: true }),
        body: fields.text({ label: 'Body', multiline: true, description: 'Leave a blank line between paragraphs.' }),
        photo: fields.image({ label: 'Photo', directory: 'public/images/about', publicPath: '/images/about/' }),
        photoAlt: fields.text({ label: 'Photo description (for screen readers)' }),
        hobbiesHeading: fields.text({ label: 'Heading above the hobby photos', defaultValue: 'A designer and…' }),
        hobbies: fields.array(
          fields.object({
            title: fields.text({ label: 'Title' }),
            text: fields.text({ label: 'Text', multiline: true }),
            images: fields.array(
              fields.object({
                image: fields.image({ label: 'Image', directory: 'public/images/about', publicPath: '/images/about/' }),
                alt: fields.text({ label: 'Image description (for screen readers)' }),
              }),
              { label: 'Images', itemLabel: (p) => p.fields.alt.value || 'Image' },
            ),
          }),
          {
            label: 'Outside of design (three, laid out as in the design: one photo, two overlapping photos, one photo)',
            itemLabel: (p) => p.fields.title.value,
          },
        ),
      },
    }),
    home: singleton({
      label: 'Home page',
      path: 'src/content/home',
      format: { data: 'yaml' },
      schema: {
        loadingLine: fields.text({ label: 'Loading screen line (put *stars* around the bold italic word)', defaultValue: 'where does *curiosity* take you?' }),
        name: fields.text({ label: 'Name', defaultValue: 'Chloe Y. Jung' }),
        tagline: fields.text({ label: 'Tagline, first line' }),
        highlight: fields.text({ label: 'Italic word ending the first line', defaultValue: 'why' }),
        taglineSecond: fields.text({ label: 'Tagline, second line' }),
        projectsHeading: fields.text({ label: 'Projects heading', defaultValue: 'Work' }),
        studioHeading: fields.text({ label: 'Studio teaser heading', multiline: true }),
        studioImages: fields.array(
          fields.image({ label: 'Image', directory: 'public/images/sketchbook', publicPath: '/images/sketchbook/' }),
          { label: 'Studio teaser images (narrow, wide, medium)', itemLabel: (p) => p.value?.filename ?? 'Image' },
        ),
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
            heroShape: fields.text({ label: 'Big image shape (width / height)', description: 'e.g. 1740 / 510. Leave empty for the usual 1440 / 540.' }),
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
