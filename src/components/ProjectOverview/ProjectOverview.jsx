import "./ProjectOverview.css";

function ProjectOverview({ projects, title = "Project Overview", onViewAll, onProjectOpen, headerAction, compact = false }) {
  const newestFirst = [...projects].sort((a, b) => Number(b.id) - Number(a.id));

  return (
    <div className="dashboard-card project-card">

      <div className="card-header">
        <h3>{title}</h3>
        {headerAction}
      </div>

      <div className={`table-wrapper${compact ? " project-table-scroll" : ""}`}>

        <table>

          <thead>
            <tr>
              <th>Project Name</th>
              <th>Category</th>
              <th>Location</th>
              <th>Total Units</th>
              {!compact && (
                <>
                  <th>Sold Units</th>
                  <th>Available Units</th>
                  <th>Expected ROI</th>
                  <th>Tenure</th>
                  <th>Status</th>
                </>
              )}
            </tr>
          </thead>

          <tbody>

            {newestFirst.map((project) => (
              <tr
                key={project.id}
                className={onProjectOpen ? "project-table-row" : undefined}
                tabIndex={onProjectOpen ? 0 : undefined}
                title={onProjectOpen ? "Double-click to edit project" : undefined}
                onDoubleClick={onProjectOpen ? () => onProjectOpen(project) : undefined}
                onKeyDown={onProjectOpen ? (event) => {
                  if (event.key === "Enter") onProjectOpen(project);
                } : undefined}
              >

                <td className="project-name-cell">
                  <strong>{project.name}</strong>
                </td>

                <td>{project.category || "-"}</td>

                <td>{project.location}</td>

                <td>{project.totalUnits}</td>

                {!compact && (
                  <>
                    <td>{project.soldUnits}</td>
                    <td>{project.availableUnits}</td>
                    <td>{project.expectedROI == null ? "-" : `${project.expectedROI}%`}</td>
                    <td>{project.tenure == null ? "-" : `${project.tenure} Years`}</td>
                    <td>
                      <span className={project.status === "Active" ? "status-active" : "status-inactive"}>
                        {project.status}
                      </span>
                    </td>
                  </>
                )}

              </tr>
            ))}

          </tbody>

        </table>

      </div>

      {onViewAll && (
        <button className="view-link" onClick={onViewAll}>
          View All Projects
        </button>
      )}

    </div>
  );
}

export default ProjectOverview;
