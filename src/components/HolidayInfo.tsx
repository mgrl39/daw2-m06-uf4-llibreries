import { ComponentProps } from "../types/IpInfo";

// Componente para mostrar festivos
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
        {holidays.map((holiday, index) => {
          const dataFestiu = new Date(holiday.date);
          const dataFormatada = dataFestiu.toLocaleDateString("ca-ES", {
            day: "numeric",
            month: "long",
            year: "numeric",
          });

          return (
            <div
              key={index}
              className="p-2 mb-2 bg-dark rounded border border-secondary"
            >
              <div className="text-info fw-bold">{dataFormatada}</div>
              <div className="mt-1">{holiday.localName}</div>
              {holiday.localName !== holiday.name && (
                <div className="small text-secondary">{holiday.name}</div>
              )}

              <div className="mt-2 d-flex flex-wrap gap-1">
                {holiday.global ? (
                  <span className="badge bg-success">Nacional</span>
                ) : (
                  <span className="badge bg-warning text-dark">Regional</span>
                )}

                {holiday.counties && holiday.counties.length > 0 && (
                  <span
                    className="badge bg-info text-dark"
                    title={holiday.counties.join(", ")}
                  >
                    {holiday.counties.length} regions
                  </span>
                )}

                {holiday.types &&
                  holiday.types.map((type, i) => (
                    <span key={i} className="badge bg-secondary">
                      {type}
                    </span>
                  ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HolidayInfo;
