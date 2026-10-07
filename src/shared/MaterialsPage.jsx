const pages = [
  { id: 'two-queries', href: '/', label: 'Two queries' },
  { id: 'single-query', href: '/single-query.html', label: 'Single query' },
]

const sections = [
  {
    status: 'Active',
    hint: 'In stock. Request a restock to order up to the par level.',
  },
  {
    status: 'Pending',
    hint: 'Severe and High risk orders wait here for approval.',
  },
  {
    status: 'Completed',
    hint: 'Stock received. Moderate and Low risk orders are approved automatically.',
  },
]

const columnLabels = [
  '#',
  'Material Number',
  'Description',
  'Manufacturer',
  'Manufacturer Item',
  'UOM',
  'Quantity',
  'Par Level',
  'On Order',
  'Risk',
  'Action',
]

export function MaterialsPage({
  currentPage,
  description,
  materials,
  isPending,
  error,
  renderRow,
}) {
  return (
    <main className="page">
      <nav className="page-nav" aria-label="Architectures">
        {pages.map((page) => (
          <a
            key={page.id}
            href={page.href}
            aria-current={page.id === currentPage ? 'page' : undefined}
          >
            {page.label}
          </a>
        ))}
      </nav>

      <header className="page-header">
        <div>
          <p className="eyebrow">TanStack Query demo</p>
          <h1>Medical materials</h1>
          <p className="subtitle">{description}</p>
        </div>
        {!isPending && !error && (
          <span className="record-count">{materials.length} materials</span>
        )}
      </header>

      {isPending && <p className="card status">Loading materials...</p>}

      {error && (
        <div className="card status error" role="alert">
          <strong>Could not load the inventory.</strong>
          <span>{error.message}</span>
        </div>
      )}

      {!isPending &&
        !error &&
        sections.map((section) => (
          <MaterialSection
            key={section.status}
            section={section}
            materials={materials.filter((material) => material.status === section.status)}
            renderRow={renderRow}
          />
        ))}
    </main>
  )
}

function MaterialSection({ section, materials, renderRow }) {
  const headingId = `section-${section.status.toLowerCase()}`

  return (
    <section className="material-section" aria-labelledby={headingId}>
      <div className="section-header">
        <h2 id={headingId}>{section.status}</h2>
        <span className={`section-count status-${section.status.toLowerCase()}`}>
          {materials.length}
        </span>
        <p className="section-hint">{section.hint}</p>
      </div>

      <div className="card">
        {materials.length === 0 ? (
          <p className="empty">No materials here.</p>
        ) : (
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  {columnLabels.map((label) => (
                    <th key={label} scope="col">
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>{materials.map(renderRow)}</tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  )
}
