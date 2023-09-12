# <p align="center">Google Palm Ai</p>

<p align="center">

  <img src="https://github.com/sauravhathi/google-palm-ai/assets/61316762/c6d44f33-be46-4215-9f47-90201f6d0d37" alt="logo" style="width: 50%">

</p>

Welcome to Google Palm Ai, a web application for generating human-like text responses with Google Palm Ai Model. Google Palm Ai is built with React and NextUI for a seamless user experience.

## Table of Contents
- [Features](#features)
- [API Usage](#api-usage)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Features

- Generate human-like text responses with Google Palm Ai Model.
- User-friendly interface for entering prompts.
- Option to view results in Markdown format.
- Copy generated text with a single click.
- Generate an access key for using the API.
- Set your access key in the application for easy access.
- Built with React and NextUI for a seamless user experience.
- Created with ❤️ by [Saurav Hathi](https://github.com/sauravhathi).

## API Usage

| **Feature** | **Value** |
| --- | --- |
| **Max Requests** | 100 |
| **Expiration** | 3 days |
| **Access Key Generation** | [Generate Access Key](https://google-palm-ai.vercel.app/generate_access_key) |
| **API Endpoint** | [https://google-palm-ai.vercel.app/api/generate](https://google-palm-ai.vercel.app/api/generate) |
| **Request Body** | `prompt` |
| **Request Headers** | `authorization` |
| **Request Body Example** | `{ "prompt": "Hello, my name is" }` |

## Tech Stack

Google Palm Ai is built using the following technologies:

- [React](https://reactjs.org/) - A JavaScript library for building user interfaces.
- [Next.js](https://nextjs.org/) - A React framework for building server-rendered applications.
- [NextUI](https://nextui.org/) - A UI framework for React applications.
- [axios](https://github.com/axios/axios) - A promise-based HTTP client for making network requests.
- [remark](https://github.com/remarkjs/remark) - A Markdown processor powered by plugins.
- [html](https://github.com/remarkjs/remark-html) - A plugin for converting Markdown to HTML.

## Getting Started

To get started with Google Palm Ai, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/sauravhathi/google-palm-ai.git
   ```

2. Install the required dependencies:

   ```bash
   cd google-palm-ai
   npm install

   # or

   yarn
   ```

3. Start the development server:

   ```bash
   npm run dev

   # or

   yarn dev
   ```

4. Open your browser and visit [http://localhost:3000](http://localhost:3000) to access the application.

## Usage

1. Generate an access key by visiting the [Generate Access Key](https://google-palm-ai.vercel.app/generate_access_key) page.
2. Copy the access key and set it in the application by clicking the "Set Access Key" button.
3. Visit the [Home](https://google-palm-ai.vercel.app/) page to generate text.
4. Enter your prompt in the "Ask a question" text area.
5. Click the "Submit" button to generate a response.
6. View the generated text in the "Result" section.
7. Toggle the "Markdown" checkbox to switch between Markdown and plain text view.
8. Click the "Copy" button to copy the generated text to your clipboard.

## Contributing

Contributions to Google Palm Ai are welcome! If you'd like to contribute, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Make your changes and commit them with descriptive messages.
4. Push your changes to your fork.
5. Create a pull request to the `master` branch of the original repository.

Please ensure your code follows best practices and includes relevant tests if applicable.

## License

Google Palm Ai is licensed under the [MIT License](https://github.com/sauravhathi/google-palm-ai/blob/master/LICENSE).

---

Made with ❤️ by [Saurav Hathi](https://github.com/sauravhathi). Enjoy using Google Palm Ai!
