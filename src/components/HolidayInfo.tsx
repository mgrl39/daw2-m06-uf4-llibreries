import { ComponentProps } from "../types/IpInfo";

// Component per mostrar festius
const HolidayInfo = ({
  holidays = [],
  country = "",
  isVisible = false,
}: ComponentProps) => {
  if (!isVisible || !holidays?.length) return null;

  return (
    <div
      className="bg-dark border border-secondary rounded overflow-auto"
      style={{ maxHeight: "400px" }}
    >
      <div className="p-3 border-bottom border-secondary">
        <h5 className="text-warning mb-1">🎉 Festius - {country}</h5>
        <small>
          {new Date() > new Date(holidays[0].date)
            ? "Festius més recents"
            : "Propers festius"}
        </small>
      </div>

      <div className="p-2">
        {holidays.map((h, i) => (
          <div
            key={i}
            className="p-2 mb-2 bg-dark rounded border border-secondary"
          >
            <div className="text-info fw-bold">
              {new Date(h.date).toLocaleDateString("ca-ES", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </div>
            <div className="mt-1">{h.localName}</div>
            {h.localName !== h.name && (
              <div className="small text-secondary">{h.name}</div>
            )}

            <div className="mt-2 d-flex flex-wrap gap-1">
              <span
                className={`badge ${
                  h.global ? "bg-success" : "bg-warning text-dark"
                }`}
              >
                {h.global ? "Nacional" : "Regional"}
              </span>

              {h.counties && h.counties.length > 0 && (
                <span
                  className="badge bg-info text-dark"
                  title={h.counties.join(", ")}
                >
                  {h.counties.length} regions
                </span>
              )}

              {h.types &&
                h.types.map((type, j) => (
                  <span key={j} className="badge bg-secondary">
                    {type}
                  </span>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HolidayInfo;
