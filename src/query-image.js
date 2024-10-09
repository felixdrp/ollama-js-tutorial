// Run: bun query-image.js <IMAGE_PATH>
// bun query-image.js ./media/576px-Pennywell_Farm_is_home_to_some_beautiful_Highland_Cows.jpg

import { parseArgs } from "util";
import ollama from 'ollama'

const { values, positionals } = parseArgs({
  args: Bun.argv,
  options: {
    // Define any flags you want to use here
  },
  allowPositionals: true,
});

// console.log(positionals);

const image = Bun.file(positionals[2]);
const imageBytes = await image.bytes()
// const imageEncodedBase64 = new Buffer(imageBytes).toString('base64')
// console.log(new Buffer(imageBytes).toString('base64'))

const model = 'minicpm-v'
const prompt = "What is in this picture?"

const response = await ollama.generate({
  model: model,
  prompt: prompt,
  stream: false,
  images: [imageBytes],
  options: {
    // seed: 123
    // seed: 314
  },
})

console.log(response)

