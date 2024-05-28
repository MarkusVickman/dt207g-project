# Projekt-API i kursen Dt207G - Backend-baserad webbutveckling - Ett restaurang api för att administrera en restaurangwebbplats

Apit kan hantera inloggningar för admin, skicka och ta emot ordrar, hämta och redigera i menyn. Det går också att hantera inloggningar för flera användare till adminsidan.
Detta repository innehåller kod för ett REST API byggt med Express. Apiet kan ta emot CRUD (Create, Read, Update, Delete).

## Testwebbplats
Följ denna [Grillhörnan](https://grillhornan.netlify.app/) om du vill testa restaurangwebbplatsens front som använder vissa delar av api-funktionerna och logga in på [Grillhörnan/login](https://grillhornan.netlify.app/login.html) med användarnamn: admin och lösenord: password för att se exempel på de administrativa funktionerna. För att se repot för testwebbplatsen följ denna [länk](https://github.com/MarkusVickman/projekt_adminwebb).

## Lösenordshantering
Lösenorden är hashade och går inte att se eller återställa till klartext. Användaren är den ända som vet sitt valda lösenord.

## Installation, databas
APIet använder en mongoDb-databas. För att ansluta till din databas måste environment variables för inloggningsuppgifter lagras hos din valda webbhost. Den här webbtjänsten använder [Atlas/mongoDb](https://www.mongodb.com/atlas) till sin mongoDb server. Webbadress till databasen finns under connections inne i atlas gränssnittet. För att säkerställa att input-data följde en viss struktur användes mongoose istället för mongoDb för att ansluta till databasen i nodeJs. Mongoose installeras som tillägg i node.js. Föjande scheman användes till mongoose för att säkertställa rätt struktur:

### Schema - Inloggning/Registrering
```
const WorkerSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    },
    verified: {
        type: Boolean,
        default: false
    }
});
```

### Schema - Ordrar
```
const orderSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    foods: {
        type: Array,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    },
    completed: {
        type: Boolean,
        default: false
    }
});
```

### Schema - Meny
```
const MenuSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    menyType: {
        type: String,
        required: true
    },
    foodName: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    }
});
```

## Alla routes som börjar på /protected kontrolleras först om de har en giltig JWT-token.

## Användning - Inloggning/Registrering
För registrering räcker det att skicka med ett användarnamn som inte redan finns i databasen och ett lösenord.
Vid inloggning med giltigt användarnamn och lösenord skickas en JWT-token tillbaka i svaret vid inloggning i JSON format. { messege: "Login successful", token: token }. Token kan lämplig lagras i localstorage, sessionstorage, cookie eller ännu bättre http only cookie.
Nedan finns beskrivet hur man nå APIet på olika vis:

|Metod  |Ändpunkt                      |Beskrivning                                                         |
|-------|------------------------------|--------------------------------------------------------------------|
|POST   |/account/login                |Logga in användare och hämtar JWT-token.                            |
|POST   |/account/register             |Registrerar en användare.                                           |
|GET    |/protected/user               |För att admin-kontot ska hämta allas användaruppgifter i JSON-format|
|PUT    |/protected/user/verify        |Admin ger en användare tillgång till adminwebben.                   |
|DELETE |/protected/user/delete:id     |Raderar en användare med id. skyddar route medJWT-token.            |

För inloggning/registrering skickas följande struktur som JSON:

```
{
"username": "Markus"
"password": "MittSäkraLösenord"
}
```

Svar vid inloggning giltig inloggning returnerar JSON:

```
{ messege: "Login successful", token: token }
```

För att hämta information om användaren eller ta bort användaren skickas endast JWT-token i headern:

```
headers: {
            'authorization': 'Bearer ' + sessionStorage.getItem("token")
        }. 
```

## Användning - Ordrar
För att få åtkomst till dessa måste användaren först logga in för att hämta en JWT-token. JWT-token skickas tillbaka i svaret vid inloggning i JSON format: { messege: "Login successful", token: token }. Token kan lämplig lagras i localstorage, sessionstorage, cookie eller ännu bättre http only cookie. Denna JWT-token ska skickas med i headern på detta sätt:  

```
headers: {
            'authorization': 'Bearer ' + sessionStorage.getItem("token")
        }.
```

Nedan finns beskrivet hur man nå APIet på olika vis:

|Metod  |Ändpunkt                     |Beskrivning                                                                          |
|-------|-----------------------------|-------------------------------------------------------------------------------------|
|GET    |/protected/order             |Hämtar alla lagrade ordrar.                                                          |
|POST   |/checkout                    |Skickar en ny beställning.                                                           |
|POST   |/protected/order/completed   |Tar in id som body parameter (req.body.indexId)                                      |
|DELETE |/protected/order/delete/:ID  |Raderar en order med angivet ID. Inläggs id skickas med som parameter.               |

En order med route /checkout skickas som JSON med följande struktur:
```
{
"userName": "Markus"
"email": "macke@gmail.com"
"foods": { "mat1", "mat2", "mat3" } 
}
```

## Användning - Meny
För att få åtkomst till dessa måste användaren först logga in för att hämta en JWT-token. JWT-token skickas tillbaka i svaret vid inloggning i JSON format: { messege: "Login successful", token: token }. Token kan lämplig lagras i localstorage, sessionstorage, cookie eller ännu bättre http only cookie. Denna JWT-token ska skickas med i headern på detta sätt:  

```
headers: {
            'authorization': 'Bearer ' + sessionStorage.getItem("token")
        }.
```

Nedan finns beskrivet hur man når APIet på olika vis:

|Metod  |Ändpunkt                     |Beskrivning                                                                          |
|-------|-----------------------------|-------------------------------------------------------------------------------------|
|GET    |/menu                        |Hämtar hela menyn.                                                                   |
|POST   |/protected/menu/edit         |skapar en ny rad i menyn.                                                            |
|DELETE |/protected/menu/delete:id    |Tar in id som body parameter (req.body.indexId)                                      |

En menyrad läggs till genom att JSON skickas med följande struktur:
```
{
"userName": "Markus"
"menyType": "macke@gmail.com"
"foodName": "Pasta Carbonara"
"description": "tagliatelli med pancetta och ägg"
"price": "120"
}
```
En menyrad ändras genom att JSON skickas med följande struktur (fälten är valfria, ett räcker):
```
{
"userName": "Markus"
"menyType": "macke@gmail.com"
"foodName": "Pasta Carbonara"
"description": "tagliatelli med pancetta och ägg"
"price": "120"
"created": ""
}
```

## Markus Vickman
Jag läser till en högskoleexamen i datateknik med inriktning webbutveckling på mittuniversitet.

### Student ID: mavi2302

