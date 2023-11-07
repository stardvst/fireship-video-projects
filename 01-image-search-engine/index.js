import weaviate from 'weaviate-ts-client'
import fs from 'fs';

const schemaConfig = {
  'class': 'Meme',
  'vectorizer': 'img2vec-neural',
  'vectorIndexType': 'hnsw',
  'moduleConfig': {
    'img2vec-neural': {
      'imageFields': [
        'image'
      ]
    }
  },
  'properties': [
    {
      'name': 'image',
      'dataType': ['blob']
    },
    {
      'name': 'text',
      'dataType': ['string']
    }
  ]
}

const img = fs.readFileSync('./img/joker.jpg');
const b64 = Buffer.from(img).toString('base64');

const client = weaviate.client({
  scheme: 'http',
  host: 'localhost:8080'
});

await client.data.creator()
  .withClassName('Meme')
  .withProperties({
    image: b64,
    text: 'joker'
  })
  .do();

const test = Buffer.from(fs.readFileSync('./img/kermit.jpg').toString('base64'));
const resImage = await client.graphql.get()
  .withClassName('Meme')
  .withFields(['image'])
  .withNearImage({ image: test })
  .withLimit(1)
  .do();

const result = resImage.data.Get.Meme[0].image;
fs.writeFileSync('./result.jpg', result, 'base64');

//const schemaRes = await client.schema.classCreator(schemaConfig).withClass().do();
//console.log(schemaRes);
