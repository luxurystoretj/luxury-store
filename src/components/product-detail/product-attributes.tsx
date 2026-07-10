interface ProductAttribute {
  label: string
  value: string | null
}

interface ProductAttributesProps {
  attributes: ProductAttribute[]
}

// Centralized null-omission rule: a null/empty value drops its row entirely,
// never a placeholder — quiet-luxury minimalism, no field renders "null" text.
function ProductAttributes({ attributes }: ProductAttributesProps) {
  const present = attributes.filter(
    (attribute): attribute is { label: string; value: string } =>
      attribute.value !== null && attribute.value !== ""
  )

  if (present.length === 0) {
    return null
  }

  return (
    <dl className="space-y-4">
      {present.map((attribute) => (
        <div key={attribute.label}>
          <dt className="text-xs font-medium tracking-wide text-foreground uppercase">
            {attribute.label}
          </dt>
          <dd className="mt-1 text-sm text-foreground">{attribute.value}</dd>
        </div>
      ))}
    </dl>
  )
}

export { ProductAttributes }
export type { ProductAttribute }
