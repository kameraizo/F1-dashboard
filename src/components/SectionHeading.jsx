function SectionHeading({ eyebrow, title }) {
  return (
    <div className="section-heading">
      <span className="section-heading__tag">{eyebrow}</span>
      <h2 className="section-heading__title">{title}</h2>
    </div>
  )
}

export default SectionHeading
