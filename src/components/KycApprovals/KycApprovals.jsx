import "./KycApprovals.css";

function KycApprovals({ data, onReview }) {

  const total =
    data.pending +
    data.approved +
    data.rejected;

  const pendingPercent =
    (data.pending / total) * 100;

  const approvedPercent =
    (data.approved / total) * 100;

  const rejectedPercent =
    (data.rejected / total) * 100;

  return (
    <div className="dashboard-card kyc-card">

      <h3>KYC Approvals</h3>

      <div
        className="donut"
        style={{
          background: `conic-gradient(
            #2878e8 0 ${pendingPercent}%,
            #3db88a ${pendingPercent}% ${pendingPercent + approvedPercent}%,
            #e83232 ${pendingPercent + approvedPercent}% 100%
          )`
        }}
      >
        <div className="donut-center">
          {total}
        </div>
      </div>

      <div className="legend">

        <div>
          <span className="legend-dot pending"></span>
          Pending
          <strong>{data.pending}</strong>
        </div>

        <div>
          <span className="legend-dot approved"></span>
          Approved
          <strong>{data.approved}</strong>
        </div>

        <div>
          <span className="legend-dot rejected"></span>
          Rejected
          <strong>{data.rejected}</strong>
        </div>

      </div>

      {onReview && (
        <button className="view-link" type="button" onClick={onReview}>
          Review KYC Submissions
        </button>
      )}

    </div>
  );
}

export default KycApprovals;