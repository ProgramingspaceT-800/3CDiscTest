import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, CardContent } from '../styles/pages/Home';
import logoPlataforma from '../assets/logo plataforma.png';
import background from '../assets/background.jpeg'

const Home: React.FC = () => {
  const [bases] = useState({
    'G - FGTS': '29870',
    'C e M - INSS PORTABILIDADE ATUALIZADA FILE': '78025',
    'M - UNIFICADA GRUPO SP - GOV/PME/SPPREV': '80797',
    'G - INSS PORTABILIDADE': '69098',
    'C - BASE FILE PORT INBURSA/CREFISA': '83106',
    'I - TJSP': '62048',
    'C e M - INBURSA PORTANDO D+ BANCOS PARA: ACIMA DE 500': '83752',
    'G - PMESP AUMENTO 20%': '70014',
    'M - GOV MT GERAL': '70967',
    'C - INSS PORTABILIDADE INBURSA': '80802',
    'G - PMSP - PREMIUM': '80801',
    'M - SANTOS': '82286',
    'I - BANCO MASTER SAQUE COMPL SEFAZ': '54283',
    'G - PMSP AUMENTO 5%': '70015',
    'G - OPORTUNIDADE INSS BANCO MASTER': '30730',
    'C - INSS PORTABILIDADE CREFISA': '80803',
    'S - UNIFICADA GRUPO SP - GOV/PME/SPPREV': '80798',
    'I - PREF CURITIBA': '80595',
    'M - GOV PARANA SAQUE COMPLEMENTAR MASTER': '79162',
    'G - MARGEM REAL CARTÃO BENEFÍCIO MCC GOVSP': '70034',
    'I - PM BETIM': '60139',
    'G - GOV MARANHAO CARTAO BENEFICIO': '59136',
    'G - GOV MG - GERAL': '55691',
    'G - GOV PE': '51370',
    'G - MT GROSSO DO SUL GERAL': '50943',
    'G - SAQUE COMPLEMENTAR DAYCOVAL ACIMA 1000': '50008',
    'G - REFIN SANTANDER | REDUÇÃO TAXA | PUBLICOS': '45169',
    'G - SAQUE COMPLEMENTAR BANCO MASTER ATUALIZADO': '41975',
    'G - COMLURB SANT': '41000',
    'G - REFIN SANTANDER UNIFICADA': '38247',
    'G - GOV SANTA CATARINA': '37114',
    'G - GOV RJ CORRENTISTAS': '35994',
    'G - OSASCO': '33270',
    'G - 50 + VENDIDOS MARGEM ONLINE': '33263',
  });

  const [loading, setLoading] = useState(true);
  const [baseData, setBaseData] = useState({});
  const [expandedBase, setExpandedBase] = useState(null); // Estado para controlar a div expandida
  const [campanhasComAviso, setCampanhasComAviso] = useState([]);
  const [lastUpdate, setLastUpdate] = useState(new Date());


  useEffect(() => {
    async function fetchData() {
      try {
        const newData = {};

        for (const baseName in bases) {
          const id = bases[baseName];
          const response = await axios.get(`https://3c.fluxoti.com/api/v1/campaigns/${id}/lists?api_token=d0NLCpTnvtsY1gQu7S38RyF47fOjnHknynBjGzWxCwpXOJqXaNwWDrGqFomq`);
          const filteredData = response.data.data.filter((post) => post.weight === 1);
          newData[id] = filteredData;

          const temPorcentagemMaiorQue90 = filteredData.some((post) => parseFloat(post.completed_percentage) > 90);
          if (temPorcentagemMaiorQue90) {
            campanhasComAviso.push(id);
          }
        }

        setCampanhasComAviso(campanhasComAviso);
        setBaseData(newData);
        setLoading(false);
        setLastUpdate(new Date());
      } catch (error) {
        console.error('Erro ao buscar os dados:', error);
        setLoading(false);
      }
    }

    fetchData();
    const interval = setInterval(fetchData, 5 * 1 * 1000); // Recarrega a cada 60 minutos

    return () => clearInterval(interval); // Limpa o temporizador quando o componente é desmontado   

  }, [bases]);

  function renderPorcentagem(porcentagem) {
    const porcentagemNum = parseFloat(porcentagem);

    if (porcentagemNum === 100) {
      const porcentagemFormatada = porcentagemNum.toFixed(0);
      return <span className="porcentagem-azul">{porcentagemFormatada}%</span>;
    } else if (porcentagemNum >= 90 && porcentagemNum <= 99.99) {
      const porcentagemFormatada = porcentagemNum.toFixed(0);
      return <span className="porcentagem-vermelha">{porcentagemFormatada}%</span>;
    } else {
      const porcentagemFormatada = porcentagemNum.toFixed(0);
      return <span className="porcentagem-verde">{porcentagemFormatada}%</span>;
    }
  }


  function toggleDetails(id: string) {
    if (expandedBase === id) {
      setExpandedBase(null);
    } else {
      setExpandedBase(id);
    }
  }

  return (
    <CardContent>
      <div className='principalContent'>
        <div className="logo">
          <img src={logoPlataforma} alt="PH Negócios Plataforma" style={{ width: '400px', height: 'auto', marginTop: '5%', marginBottom: '3%' }} />
        </div>
        <nav>

          <ul className="nav-links">
            <li><a href="/">Bases</a></li>
            <li className="center"><a href="#">Graficos</a></li>
            <li className="upward"><a href="#">Adicionar</a></li>
            <li className="forward"><a href="#">Update</a></li>
          </ul>
        </nav>
        {loading ? (
          <p>Carregando...</p>
        ) : (
          <div className='Cardsalign'>
            {Object.keys(bases).map((baseName) => (
              <div
                key={baseName}
                className={`campaign-card${expandedBase === bases[baseName] ? ' clicked' : ''}`}
                onClick={() => toggleDetails(bases[baseName])}
              >
  <div className={`base ${parseFloat(baseData[bases[baseName]][0].completed_percentage) >= 90 ? 'com-aviso' : ''}`}>{baseName}</div>
                {expandedBase === bases[baseName] && (
                  <div className="campaign-percentages">
                    {baseData[bases[baseName]]?.map((post: any) => (
                      <Container key={post.id}>
                        <div
                          className={`percentage-item ${parseFloat(post.completed_percentage) >= 90
                            ? 'com-aviso' // Adiciona uma classe "com-aviso" se a porcentagem for maior que 90
                            : ''
                            }`}
                        >
                          <h3>{post.name}</h3>
                          <p>{post.created_at}</p>
                          <h3 className={`porcentagem-${post.completed_percentage === '100.00' ? 'verde' : 'vermelha'}`}>
                            {renderPorcentagem((post.completed_percentage))}
                          </h3>
                          <p>Última atualização: {lastUpdate.toLocaleTimeString()}</p>
                        </div>
                      </Container>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </CardContent>
  );
};

export default Home;




