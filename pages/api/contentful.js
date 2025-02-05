import {fetchEntries} from '../../lib/contentfulService';

export default async function handler(req, res) {
  try {
    const posts = await fetchEntries(); // Fetch from Contentful
    res.status(200).json(posts); // Send response as JSON
  } catch (error) {
    console.error('Contentful API Error:', error);
    res.status(500).json({ message: 'Failed to fetch data', error });
  }
}