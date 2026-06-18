import { Helmet } from 'react-helmet-async'

type Props = {
  title: string
  description: string
  path: string
  image?: string
  ogTitle?: string
  ogDescription?: string
  jsonLd?: object | object[]
}

const BASE = 'https://soulcinema.de'

export function Seo({ title, description, path, image, ogTitle, ogDescription, jsonLd }: Props) {
  const url = `${BASE}${path}`
  const img = image && /^https?:\/\//.test(image) ? image : image ? `${BASE}${image.startsWith('/') ? '' : '/'}${image}` : undefined
  const ogT = ogTitle ?? title
  const ogD = ogDescription ?? description
  const ldArray = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : []
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta property="og:site_name" content="Soul Cinema" />
      <meta property="og:locale" content="de_DE" />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={ogT} />
      <meta property="og:description" content={ogD} />
      <meta property="og:url" content={url} />
      {img && <meta property="og:image" content={img} />}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={ogT} />
      <meta name="twitter:description" content={ogD} />
      {img && <meta name="twitter:image" content={img} />}
      {ldArray.map((ld, i) => (
        <script key={i} type="application/ld+json">{JSON.stringify(ld)}</script>
      ))}
    </Helmet>
  )
}
