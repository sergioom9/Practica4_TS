# Práctica 4 

### Deno Deploy
[[https://important-owl-35.deno.dev/](https://important-owl-35-rv1jw3e06ja8.deno.dev/)]([https://important-owl-35.deno.dev/](https://important-owl-35-rv1jw3e06ja8.deno.dev/))

## Endpoints

### TARDIS

#### Obtener información de la TARDIS mediante su ID 
GET: ` /get_tardis/:id  `


#### Crear nueva TARDIS 
POST: ` /post_tardis `

Formato del Body:
  
{
    "camuflaje": "green",
    "numero_regeneracion": 33773,
    "ano": 2024,
    "dimensiones" : ["","",""]
}


#### Actualizar informacion Tardis mediante su ID
PUT: /put_tardis/:id
(necesario un body)


#### Borrar TARDIS mediante su ID 
DELETE: /delete_tardis/:id






### DIMENSIONES

#### Obtener información de la Dimension mediante su ID 
GET: ` /get_dimension/:id  `


#### Crear nueva dimension 
POST: ` /post_dimension `

Formato del Body:
  
{
    "planetas": ["", "", ""] 
}

#### Actualizar informacion Dimension mediante su ID
PUT: /put_dimension/:id
(necesario un body)


#### Borrar Dimension mediante su ID 
DELETE: /delete_dimension/:id







### PERSONA

#### Obtener información de la Persona mediante su ID 
GET: ` /get_persona/:id  `


#### Crear nueva persona 
POST: ` /post_persona `

Formato del Body:
  
{
    "nombre": "Aurelio"
}

#### Actualizar informacion Persona mediante su ID
PUT: /put_persona/:id
(necesario un body)


#### Borrar Persona mediante su ID 
DELETE: /delete_persona/:id








### PLANETA

#### Obtener información del Planeta mediante su ID 
GET: ` /get_planeta/:id  `


#### Crear nuevo planeta 
POST: ` /post_planeta `

Formato del Body:
  
{
    "personas": ["", "", ""] 
}

#### Actualizar informacion Planeta mediante su ID
PUT: /put_planeta/:id
(necesario un body)


#### Borrar Planeta mediante su ID 
DELETE: /delete_planeta/:id




