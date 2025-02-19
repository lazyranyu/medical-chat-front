const StructuredData = ({ ld }) => {
  return (
      <script
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
          id="structured-data"
          type="application/ld+json"
      />
  )
}
export default StructuredData
