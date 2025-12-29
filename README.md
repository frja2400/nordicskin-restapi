# REST API - Nørdic Skin

Detta repository innehåller ett REST API byggt med Node.js, Hapi och MongoDB Atlas. API:et är utvecklat för en fiktiv webbshops intranät-applikation och hanterar användare samt produkter med full CRUD-funktionalitet samt sökning, filtrering och sortering. Autentisering, registrering och inloggning är implementerat med HTTP Cookie.

## Länk

En liveversion av API:t finns tillgänglig på följande URL: 

## Installation, databas

API:et använder MongoDB Atlas för datalagring.
För att installera och köra lokalt:

- git clone https://github.com/frja2400/nordicskin-restapi.git
- npm install
- Skapa en .env-fil och ange miljövariabler enligt .env-sample.
- Starta servern: npm run start

## Datamodeller

```js
const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0 },
    description: { type: String, required: true },
    category: { type: String, required: true },
    imageUrl: { type: String }
}, { timestamps: true });

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    department: { type: String, required: true },
    password: { type: String, required: true }
}, { timestamps: true });
```

## Användning

**Användare:**
| Metod  | Ändpunkt                  | Beskrivning                                   |
|--------|---------------------------|-----------------------------------------------|
| POST   | `/api/register`           | Registrerar ny användare.                     |
| POST   | `/api/login`              | Loggar in användare.                          |
| POST   | `/api/logout`             | Loggar ut användare.                          |
| POST   | `/api/users`              | Lägger till ny användare.                     |
| GET    | `/api/users`              | Hämtar alla användare.                        |
| GET    | `/api/users/:id`          | Hämtar specifik användare.                    |
| PUT    | `/api/users/:id`          | Uppdaterar användare.                         |
| DELETE | `/api/users/:id`          | Raderar användare.                           |

**Produkter:**
| Metod  | Ändpunkt                  | Beskrivning                                   |
|--------|---------------------------|-----------------------------------------------|
| GET    | `/api/products`           | Hämtar alla produkter.                        |
| GET    | `/api/products/:id`       | Hämtar specifik produkt.                      |
| POST   | `/api/products`           | Lägger till ny produkt.                       |
| PUT    | `/api/products/:id`       | Uppdaterar produkt.                           |
| DELETE | `/api/products/:id`       | Raderar produkt.                              | 
| PATCH  | `/api/products/:id/stock` | Ökar eller minskar lagersaldo.                |

## Validering

Validerar routes med Joi:
- params för path-variabler (id).
- payload för POST/PUT/PATCH-data.
- query-parameter för sökning, filtrering och sortering.
- Returnerar statuskoder.

## Autentisering med HTTP Cookie

API:et använder session-baserad autentisering med HTTP Cookies via @hapi/cookie:
- Registrering och inloggning är öppna routes.
- Alla andra routes är skyddade.
- Session lagras i en HTTP-only cookie.
- Utloggning rensar session-cookien.

## Sökning, filtrering, sortering

API:et stödjer sökning, filtrering och sortering av produkter via query-parametrar:
- Sökning på produkters namn.
- Filtrering på produkters kategorier.
- Sortering på produkters namn, lagersaldo och senaste uppdatering.