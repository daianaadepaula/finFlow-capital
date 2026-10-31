import requests
from datetime import date
from domain.entities import MarketRate
from domain.interfaces import IBCBService

class BCBService(IBCBService):
    """Cliente HTTP para a API oficial do Banco Central do Brasil."""

    BCB_SELIC_URL = "https://api.bcb.gov.br/dados/serie/bcdata.sgs.432/dados/ultimos/1?formato=json"

    def get_latest_selic_rate(self) -> MarketRate:
        try:
            response = requests.get(self.BCB_SELIC_URL, timeout=5)
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list) and len(data) > 0:
                    latest = data[0]
                    rate_val = float(latest["valor"])
                    ref_date = str(latest["data"])
                    return MarketRate(
                        indicator_name="Taxa Selic Meta (% a.a.)",
                        annual_rate=rate_val,
                        reference_date=ref_date,
                        is_fallback=False
                    )
        except Exception:
            pass

        # Fallback de mercado em caso de instabilidade na API governamental
        return MarketRate(
            indicator_name="Taxa Selic Meta (% a.a.)",
            annual_rate=13.75,
            reference_date=date.today().strftime("%d/%m/%Y"),
            is_fallback=True
        )

