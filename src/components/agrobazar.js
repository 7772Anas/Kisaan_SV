import React, { useEffect } from 'react';
import 'aos/dist/aos.css';
import AOS from 'aos';
import bigh from '../ks-images/bigh.jpg';

const agroWebsites = [
  {
    name: 'BigHaat',
    subtitle: "India's largest farm-to-table marketplace",
    description:
      'Connect directly with farmers across India to source the freshest produce, grains, and organic products. Our platform ensures fair pricing for farmers while delivering premium quality products to your doorstep.',
    features: ['Direct from Farm', 'Organic Certified', 'Same Day Delivery'],
    image: bigh,
    link: 'https://www.bighaat.com/',
  },
  {
    name: 'Agri-Begri',
    subtitle: 'Trusted Agri-Input Platform',
    description:
      'Buy seeds, fertilizers, and crop protection products from trusted brands. Expert advice and doorstep delivery.',
    features: ['Expert Advice', 'Wide Range', 'Doorstep Delivery'],
    image: 'data:image/jpeg;base64,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',
    link: 'https://agribegri.com/',
  },
  {
    name: 'AgroStar',
    subtitle: 'End-to-End Agri Solutions',
    description:
      'Comprehensive platform for agri-inputs, advisory, and market linkages. Empowering farmers with technology.',
    features: ['Agri Advisory', 'Market Linkage', 'Tech Driven'],
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRlpoG6kv4T4G_XzgU8zEJYZp3yXa1pHiK7smcvehFR--YoTp0KC5uZWJrBlmjYOwxCEx4&usqp=CAU/wnhv52pCmp0VAR8TxQBr2NCdzstBk8Eys6hzmswvkwH3RHHh3TdskeNd_HWEkn-RhA=w240-h480-rw',
    link: 'https://agrostar.in/shop-na?language=te&state=telangana',
  },
  {
    name: 'AgriPari',
    subtitle: 'Smart Farming Platform',
    description:
      'Personalized crop advisory, quality agri-inputs, and transparent pricing for Indian farmers.',
    features: ['Personalized Advisory', 'Quality Inputs', 'Transparent Pricing'],
    image: 'https://image.winudf.com/v2/image1/Y29tLmFncmlwYXJpLmVjb21tZXJjZV9pY29uXzE2MDEzMTMyNzhfMDQ4/icon.png?w=184&fakeurl=1',
    link: 'https://agripari.com/',
  },
  {
    name: 'Gramophone',
    subtitle: 'Online Agri Marketplace',
    description:
      'Buy and sell agri produce, machinery, and inputs. Connecting farmers and buyers directly.',
    features: ['Buy & Sell', 'Machinery', 'Direct Connect'],
    image: 'data:image/jpeg;base64,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',
    link: 'https://gramophone.in/',
  },
  {
    name: 'Kisaan Mandi',
    subtitle: 'Fresh Produce Supply Chain',
    description:
      'Efficient supply chain for fresh produce. Connecting farmers to retailers and businesses.',
    features: ['Fresh Produce', 'Efficient Supply', 'Retail Connect'],
    image: 'https://www.kisanmandi.com/images/Kisanmanid.png',
    link: 'https://www.kisanmandi.com/',
  },
  {
    name: 'Badi Kheti',
    subtitle: 'Digital Agri Trading',
    description:
      'Digital marketplace for agri commodities. Transparent pricing and secure transactions.',
    features: ['Digital Trading', 'Secure Payments', 'Transparent Pricing'],
    image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAVMAAACVCAMAAADSU+lbAAABMlBMVEX///////7//f/9//////z//f7/+//8//sbnFD5//+02sUAlEcjklX///sbm1Xx//sVnk1du1Ncp3673c5vvGRauU36//jo6OgAAABau1NitINVVVXa2tpYvE5duVUDmU1BQUHy8vJ9wHV3t3Gk0J9st4zIyMh2dnb0//MAk01gt1hvs4xhYWG6urpMTEzNzc2QkJBpaWlzc3Pk+eKYzLF6wnSJwX9erlTw/+3O5cXW+ua227IAiUKgoKCHh4c8PDwwMDAfHx+srKzf8Oej0p2617qSw46y0MEpnGYtkF57vJyGyaOPwadIl26v3q9mrl/W99Hf9thKoWy06c1TvkZxr2Wnzqak1rbR8skvnF3X69a+5M9+w5q/57WKyYJ2z6EEgkORzI1Ztn/J7d+Rto4jIyPR+3wAAAARjElEQVR4nO2bCVsTydqGa+1Kk41EumOA7hhF6DSyGSAJmwoZB9GBIZNRlpEzHr75/3/he95KojjbkePMGK9Tj3qZdHcq6TvvWlVhzMnJycnJycnJycnJycnJycnJycnJycnJycnJycnJycnJycnJycnJycnJycnJycnJycnJycnJycnJycnJ6X9LXDNjFP+sITgTejSC5ioMFdNaKS7xXEo5uk5KXHnLdxJa6/cjcM61EPjfmA+jjqGEBgD6oP+1uFISX8zwJjUNKMBPYVxmmY7OMMn0bVko35d4h9EzaUfhCqQ/4xP/3eJ5pT3xOXaq8vwDOKm41ta2pLRMPxgqMEh5W6bG0Hh8NIL0pfS18AQefcZH/ptljMA/8xkjwCGZhHkOnmAsrUIltMVHMEYUJTG5rX1JIW5auk/fFEz31t/NPyvPE8Z4nzGAlEIb5Q3Ch/A09zyKd2St/Oad++Bp+C2jjOf7TNyIyGBsrZV9Vrj6u2XaifQ+iykTJgxH7snCUHse3bUisjeggrLx/Vt6hIe4XDwYxlMp7Ric4qs/poZKHJJu67kR4WeMorgw33zTHIynOs+7TXCDGfmXr+qW6dDdYc7+t98mtxtcGrV++OLDi7Qsfns0UdRiLJ1fC5UXXrIRRPfNbSucjwcyOrwfxGfKC43YTtP+SQJ6XrGczd6BcapR0kY1UMxlG5eKUvcney5/uVNrFIfvhATFfmrUGq/wcCx9X5q8ZNtplZh+TmVimUalk6ZAXfq8H/fjjvSkfNXIND5mqsE0k3nR5iDyyaMf5AqThSFT38BMDzOZzHf+WJopQwGkpNmM/xqmQSnosjyTx1EQnTSV8BPgI6bi10xr60rewnMnsh+YolDj4XQt01iUXI0jVDBFHgaMv8hOoyuKmMncg80OvNu/yE4SU/YbO60tMv8WfrteK2QKH3xf6Otyb/Hg02PHPysqpvMPqn8V0+CK+QjSKAFMiD5qopH5faaZsvRvUaXeZDqsMRI42Limfev7pb8onsbBfSa58YQSwiCB/BlTal0/9TOuNz74PsozjgCNpO/Lz5qh+BsFpg9KQbB5s2bU6IPsbAW17BwVNu5CC6bwF3Y95GNomkB7nDihis8nG6UYvq+UESLknsjzm0ypSeUWLTGdLMNxtW3/iSww4ZFPvSb1XoMOFl2Z5PQZtGV6TrUUvUTh27dtlBB8LKHSN24eBEFw8n1nu7v54P5m9/g0ZAOmFG6Zgc3hUdJuJ9zk0X2OmCrUnyjp26fb22fNRIdFVGTRJpN5LU2SKMs0mylkR3YKelzhUTE3WQBTtOpyMC8Cs87jGzUSOPGO4FQsFiXjPmUxgf+s7+e22Pv3xTU+0PpsLJ0fTJl5EJeiII6jKOr3Izy66jAxmFBiNFenwubx5lSabrw7bnKYyfBG0IyaZPvqJA2CuLUx1/Y3gsAyVUn3weYpzQDcYApXFdbWh0xl8c7Rw+npxfVrBZR2ukWQfSp1vf6wd3g+/dNEkSYGyMXZejaTKfSmrRZ/APziq/JRooUYY6alUlRKY2AtVUtg24+fJ9QE4V7zRrDmZiutwpSDUuuki8JyOBkkuDn9EUAjUj94kGykKZiCXyeuxpsc3n2DKRp0c3DgywHTzPQPhw0EhlqtkZu+9n3haTOYZtoq52q1QoHOvHgDU/QlvMQyxSGrnQMkrUZt5wjR4cvC+wMNfL9UAkoQLVWr1VI1TqP+/YTm6shWw+0WsAW4oAp28Y+nfDgvIMwcnSnFaZrSANsbpT7iqebqNUBP+fwjpr4flhs7b4ZMJwsACk1OAlbuDQo6/BE+etBGLTNSITvdRhz2fMs0Mzk4mGl8y9jDWqZW9sfX9ymexqUggttHYBpVgSiK77eNItdjxwGdKFn1q3GUng5fqraDKC7RSSCsVoOz+3jdffhvfq4aB1PSsI/slB8B43lxaKewRKg2oLTzSlI2RA572SjYI7Xh+V4bXy2Y1nAMXwCp9vO1JqaTZX9MC9QBU5ghmaflBh8nqwxeh3ly/7NWFMPz081u934K9lF0MoSKM1EcBw+OO53tzanWu3Aztky9fLcUV6cQim8whf82MpO1794zRUHQ6JXL5w1itfNG2dC4vkOGmz0vLz7sNSzbXhGZjJhmCtOLVkfXSFoPAb18+wWDf0ZDprBQcv40DdLnF90I6arUalLZ1J6KUsTR7baiCcHXcR/h4Sr0hCeSjRgtaNyxE3wqaSu1CYO9opmYObCfovpgyFRrQ2XVZCF3wN4zbXx36ft+MnFOTwoHKNfUFkqmTO1wIvG5NNfTZLONdaqm1rO4hPI+VV5o0MhOwfTTK9x/VAOmFEYp90dxN1HsLCCmcZfKmzk4OyzTDJoec9ZCWI07VLqexbDm1veju8Iwm+ij7gPakCl7zxS1wGWOAF3KUY4q1KaLPpWsZquHQil7xJTPFsnBe218KGQrJY8aiADnW8yXxLRxMHynvFSDeIpwP8b1KWUoRNRg4xTpXjQpHZXSFDWnaZWCatoZtVg+66S4btMg42xWERTO9LAIkAiYf8jUZ02L9A0yzojpIQwbpQEqiy2yx1xRyQNqsA4POIonYPO3fqI81lhH1PwVU/41MIVVlmB1r0ONKp61WwExjS40u0BMgD97Q6bGs/MtrbaU7RZC7wYODMf5M6by4AWyduMILdmw5s80JmjKX1GHyn6y3ZaNuDguPQ/QkolyzpYGtSM+YFr4muyU2RwVBa0uC0NqS8ONKKY69a3Qx1G1FJyN4hYPBXtbrcbVCy1OEX2DLpPDxYEBU4qnv2XKE3LvxqJhbOT7k7mE+cj1Pg19nbXmyBZrk4XzoubcXB4BaIECbQ3GTeN8fb4fleDIc6FBq4kum1+hRkLYPGbsXVSN0vb7dXt0rKdI/lGHsU6AHuF7LT+y099nKheRthuIkwRwaKffSbt5Aj0+k0XEzcZD5k8juZd9U5zoNUDXlqKN3iXXXx9TfGby/WCj7amwgtQgQTJF6R8cs/CqWuqnIUOlw2mbihS6SXX+ayY7QbXfaqL+p6kRKkrfM+W/ZvqKyqLclkGbOer3wU6jt6cZE0TOQgEpixUPYZgP2Z2cLftRADRyi9dKegivE2TJB/iwtJY97kyVQlPINvv9VnrGdPg6UXl0T1fopNAenTG2kVajVsLB1Bi02UgXyRQK/NcKTON+fMrpEG1pEEYjZFSD57Dl/OuPmL45z9j0zY3keminAPKhuCxSfT/NTI/stP3C+nymlu2tF2nWTHNjx8ldY2j+NTDNCzDtouK/jyJqrgMjM0Jdwb1LUXrBWDdIo+BCq7yi7lEZzttTSGdzil0E6JrmmBfSHhFmQuO1UXYhwuL1H9vpv+DatX9xmptDXBj6/uJvmQLUZKG3RWczjRxKe5mnnVEC41xgnMYbeANtnhh3pjQfmkeBFEdvtbzYSGgOTSRTVKlGG6jmO2Da7yJxSbod4COmcdDlIkHXFU2FnqHZTK0Mmlia23pLi0/dj5i+RIlUOF9PlPDliGnt4e8wfdlAcXC5mM1me98W8RXYNTxN+yUOzhEKpn1OMxB67GspxTUVT6W46ZmrbbhxXiNk0oRf3JVGhAEMttVE1YqMIlHm6HZqV/I89a6P6mubeUIAqxCaiqt+65QM62OmEz3qLJFtaBT5x77Prmmiqpesv7ouSp8i+ESPXsSE59ssd821j9HHnSmClTZaduMNJk9bec8PkWWP4wC4Tto4x7pUqP7YzNstUB6qAsTTAEy1PA2Q+VtniHF0yrSvgjToPw/JVT9merl1iMIITf1RgkL3j5lKWQbU7CLaK5nPG5p9nZz8uYk2SvuXtBh9uKWUNHLcmSKaImOz5GSDmSvUp56QLD8VVEtpcCxoYgppHhH15C31+yo5bRvKUcE2C33zjjqv1nY7hCmF3z+gJjZtaiHzYFoCUz7K++pgsUEzdbXDSzaKp7/DVLPrHTzIli/s0eQIoWC4O0D7PZqZOrykl6gB08K4MkXeYUgErPmatYMLFsLN1OsqWv/0XeLRggffRipCDXDS3d5+d9I66QyZomJtntC8lD1z/KCFy4L0WGI0rrppGk0Zj9b40MrfQdn0Jke9eyb3EjHSrkWXaXl/SMQu+k3TJL/FOJmdXp9YP8rVqOrPFT0MKNh1jqZPG+X1Hy4TFFQDOx3r/ad5FrLOFPX3wnRhpVG0OdqdpOZoQmUwmY/ENYWwGbU6SiAQn6aRXXAhoRGL4m5IyUqHeEnwHOWoZZpLEG79657tNHcOiGkhs7NubjA9pz6KCuPiYtZOPNeytZqdR81dYzwqqNjlTs2eaOz0EsGna5ONRcSIcYaKtr37DtEubD8P+jC4bjK0AcTQ7bQf2WWAOK4GJ8241DrGWfTu6vQkwsWBnXaN+uk2QodSQoSv+xRY0ZYhIjYmEHC5UqHt6t9wwZMc+tQiKonRJkowRWqiJSkdDqHaGelMNneZR6elDO1Yv8wNZrALO3eE+fck+jK74WNspYRhU2+ZSI5b1Wq19bz5YZEXbC8244CmqmGtrYtwKj02ykNb5QvaD2jXo3Ay3WzaRWtUq+ab+F3o0Zbeg53cpZQ+AjPwTRzmJhiKNdPL/lSkhb3Rm4TlRrnoD7aZyh96jYGJZmq5hwccnRvPKw91Fdt6iA4LhrruUzYrt2kDwRjvk+YwhZMOM51ud677FnD4aAeFpqX+sPOuRZqaO5W6sx3SnADg4SLWPN6gMxvdUyPydpYVh5Nv2kZwIC6uX/qe3dWP4kglB7bm1JfrqA6E9kcziPk75TatL1OppWUysZjb2fn55xeo+j3ma8FphwFtPlHXL6enX27lkQevy2hR5Jiumw6FEvP/LhgtltjWhRs13EZO+3S0hz4pabbDUOdDamY0/VAFf/NkKsYkSRhyjcAR0os4bYPOh9JjvIjhaDOz/ZmEj2SDAh7Dc+Fp2oI+8lypDLVpwO7RUi03xfbWVhH0PWF/b4KX4aG9nDa3ah9PUP/TsuCXI/YfJWg3SigQ4zR5G1LVaCcebUrmtLOEUaSkDTvoBDhVWTyPK/P0NdBklpC0IcAo2iYC2wZgw5RdYrbbSgiboNBIP0QxgpxcvS+mUGwIn8j5ZP30axJNv96hyTCqo2CP0lf0Cx76ioXUeHdf4D3lWDMdSQ7+cfb+Vx7M7smhJ3x0AWcfDnDKM6O4qN/vCiZzol0s7wcdXaPpBfLX60haDi6S7AalG7xop8/oub0WCV+y8VyIdnJy+lR9DUFxLOXA/Q1amJl5xOYfaba7/GiXzS7XWeVeBcfXZmaW6o+W59nuvSd7eP54ZmZmubL/5Mk+YyszT9Yqu8szM3v4t7y7V2H1x+wRHtbvzTyufOk7+vJ6WqlU2KOns2xhv748v3J3la3encXxZ/XK3frSY7b6uF7frTNWqTxZqSzdq+uZpcqzip5fwfWVemV/rVLHd1B/yp5hoPq9+tK9L31HX15PVmZn6/fm99jCPFtYWlmYqT+asUwr88tsfoHdrY+uXAb7FcZmH60u0dOF1ZX5Ol3BlvfnQfLZ/PxsfZlVnn6pOxkf3VtYWF1arT9jezOPHrOVvf2nK5bp04W1mToxZZXHC5YrmOIvQsPjWbb3eHZvbRVOb5kurO49YXf39nbrdxeezH7hGxoDPcW/tSczdyt7+7trbGVB32PL1k4Z21siphVW+WXEdG3e2uk+q6wu7c3TQWIK39dP7EAIA89cPGXghWDIlvb2ltja6goQsXvE9G5l5ZfZ/TW2v1ypP7NMgW72l0rl6Xzl7kp9dWlhF0GDzT9G+JilIe7OUhBhsx+Cxf+sVjWbRSoHJJDcW6FQuUumtrqwN1vfW1hhS2tr+/bK3bpm82vWVB+vrdaXFhYQBGaX7PX1XbaH5/iPLS190fsZS/1ZxfqfqlntCl4nJycnJycnJycnJycnJycnJycnJycnJycnJycnJycnJycnJycnJycnJycnJycnJycnJycnJycnJycnJycnJycnp/9S/w8W5OmnD7zc+AAAAABJRU5ErkJggg==',
    link: 'https://www.badikheti.com/',
  },
];

const Agrobazar = () => {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-green-200 to-white py-12 px-2">
      {/* Flip card CSS for demo purposes */}
      <style>{`
        .card {
          width: 400px;
          height: 500px;
          margin: 1rem auto;
          perspective: 1000px;
          cursor: pointer;
        }
        .card-inner {
          position: relative;
          width: 100%;
          height: 100%;
          transition: transform 1s;
          transform-style: preserve-3d;
        }
        .card:hover .card-inner {
          transform: rotateY(180deg);
        }
        .card-front,
        .card-back {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 0.5rem;
        }
        .card-front {
          background: white;
          border: 5px solidrgb(230, 235, 229);
        }
        .card-back {
          background:rgb(38, 128, 68);
          color: white;
          transform: rotateY(180deg);
        }
      `}</style>
      <div className="max-w-7xl mx-auto">
        <div className="mb-10 text-center">
          <span className="inline-block bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full mb-2">
            Trusted Agricultural Platforms
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
            Top Agro-Shopping <span className="text-yellow-600">Websites in India</span>
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Discover premium agricultural platforms offering everything from fresh produce to cutting-edge farming technology.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {agroWebsites.map((site, idx) => (
            <div
              key={site.name}
              className="card"
              data-aos="fade-up"
              data-aos-delay={idx * 100}
            >
              <div className="card-inner">
                <div className="card-front">
                  <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                    {/* Position: left for card 1 (BigHaat) */}
                    {idx === 0 && (
                      <img
                        src={site.image}
                        alt={site.name}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          borderRadius: '0.5rem',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          zIndex: 0,
                        }}
                      />
                    )}
                    {/* Position: right for card 2 (Agri-Begri) */}
                    {idx === 1 && (
                      <img
                        src={site.image}
                        alt={site.name}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain',
                          borderRadius: '0.5rem',
                          position: 'absolute',
                          top: 0,
                          right: 0,
                          zIndex: 0,
                        }}
                      />
                    )}
                    {/* Position: up for card 3 (AgroStar) */}
                    {idx === 2 && (
                      <img
                        src={site.image}
                        alt={site.name}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          borderRadius: '0.5rem',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          zIndex: 0,
                          objectPosition: 'top',
                        }}
                      />
                    )}
                    {/* Position: down for card 4 (AgriPari) */}
                    {idx === 3 && (
                      <img
                        src={site.image}
                        alt={site.name}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain',
                          borderRadius: '0.5rem',
                          position: 'absolute',
                          bottom: 90,
                          left: 0,
                          zIndex: 0,
                          objectPosition: 'bottom',
                        }}
                      />
                    )}
                    {/* Position: center for card 5 (Gramophone) */}
                    {idx === 4 && (
                      <img
                        src={site.image}
                        alt={site.name}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          borderRadius: '0.5rem',
                          position: 'absolute',
                          top: -20,
                          left: 0,
                          zIndex: 0,
                          objectPosition: 'center',
                        }}
                      />
                    )}
                    {/* Position: right for card 6 (Kisaan Mandi) */}
                    {idx === 5 && (
                      <img
                        src={site.image}
                        alt={site.name}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain',
                          borderRadius: '0.5rem',
                          position: 'absolute',
                          top: 0,
                          right: 0,
                          zIndex: 0,
                        }}
                      />
                    )}
                    {/* Position: left for card 7 (Badi Kheti) */}
                    {idx === 6 && (
                      <img
                        src={site.image}
                        alt={site.name}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain',
                          borderRadius: '1.0rem',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          zIndex: 0,
                        }}
                      />
                    )}
                    {/* Add more positions as needed for more cards */}
                    {/* Gradient overlay for text readability */}
                    <div style={{
                      position: 'absolute',
                      left: 0,
                      bottom: 0,
                      width: '100%',
                      height: '40%',
                      background: 'linear-gradient(to top, rgba(0,0,0,0.7), rgba(0,0,0,0))',
                      borderRadius: '0 0 0.5rem 0.5rem',
                      zIndex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'flex-end',
                      alignItems: 'center',
                      paddingBottom: '1.5rem',
                    }}>
                      <h2 style={{ fontWeight: 'bold', color: '#fff', margin: 0 }}>{site.name}</h2>
                      <p style={{ fontSize: '0.9rem', color: '#e0e0e0', margin: 0 }}>{site.subtitle}</p>
                    </div>
                  </div>
                </div>
                <div className="card-back">
                  <div style={{ textAlign: 'center', padding: '0 1rem' }}>
                    <p style={{ marginBottom: '0.5rem', fontSize: '0.95rem' }}>
                      {site.description}
                    </p>
                    <a
                      href={site.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        background: 'white',
                        color: '#8b5cf6',
                        padding: '0.4rem 1rem',
                        borderRadius: '0.25rem',
                        fontWeight: 'bold',
                        textDecoration: 'none',
                        display: 'inline-block',
                      }}
                    >
                      Visit Website
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Agrobazar;
