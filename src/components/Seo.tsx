import { Helmet } from 'react-helmet-async'

type Props = {
  title: string
  description: string
  path: string
  jsonLd?: object | object[]
}

const BASE = 'https://soulcinema.de'

export function Seo({ title, description, path, jsonLd }: Props) {
  const url = `${BASE}${path}`
  const ldArray = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : []
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {ldArray.map((ld, i) => (
        <script key={i} type="application/ld+json">{JSON.stringify(ld)}</script>
      ))}
    </Helmet>
  )
}
