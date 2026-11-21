import "./KycApprovals.css";

function KycApprovals({ data = {}, onReview }) {

  const pending = Number(data.pending) || 0;
  const approved = Number(data.approved) || 0;
  const rejected = Number(data.rejected) || 0;
  const total = pending + approved + rejected;

  const pendingPercent = total ? (pending / total) * 100 : 0;

  const approvedPercent = total ? (approved / total) * 100 : 0;

  const rejectedPercent = total ? (rejected / total) * 100 : 0;

  return (
    <div className="dashboard-card kyc-card">

      <h3>KYC Approvals</h3>

      <div
        className="donut"
        style={{
          background: total ? `conic-gradient(
            #2878e8 0 ${pendingPercent}%,
            #3db88a ${pendingPercent}% ${pendingPercent + approvedPercent}%,
            #e83232 ${pendingPercent + approvedPercent}% 100%
          )` : "conic-gradient(#eef2f6 0 100%)"
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
          <strong>{pending}</strong>
        </div>

        <div>
          <span className="legend-dot approved"></span>
          Approved
          <strong>{approved}</strong>
        </div>

        <div>
          <span className="legend-dot rejected"></span>
          Rejected
          <strong>{rejected}</strong>
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
