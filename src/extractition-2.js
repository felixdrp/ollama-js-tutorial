// *** Ollama nuextract model example 2, using nuextract model to extract info from a text.
// https://ollama.com/library/nuextract
import { Ollama } from '@felixdrp/ollama'

const prompt = `### Template:
{
  "names": [
    {
        "Name": "",
        "Adjectives": [],
    },
  ]
}

### Example:
{
  "names": [
    {
      "Name": "fox",
      "Adjectives": ["fast", "yellow"],
    },
    {
      "Name": "dog",
      "Adjectives": ["slow"],
    },
  ]
}
### Text:

The swift golden rabbit leaps over the sluggish cat.
The meteoric falcon dives beneath the ponderous rhinoceros, just as the fleet-footed cheetah sprints around the lumbering elephant.
`;

const ollama = new Ollama({
  host: process.env.OLLAMA_URL || "http://localhost:11434", // Default value
  headers: {
    API_KEY: process.env.API_KEY || 'guest',
  },
});

const response = await ollama.generate({
  model: 'nuextract',
  prompt: prompt,
  stream: false,
  options: {
    // seed: 123
    // seed: 314
  }
})

console.log(response)