import { NextApiRequest, NextApiResponse } from 'next';
import {fetchEntries} from '../../lib/contentfulService';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).end();
  }

  try {
    const posts = await fetchEntries(); // Fetch from Contentful
    res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
    res.status(200).json(posts); // Send response as JSON
  } catch (error) {
    console.error('Contentful API Error:', error);
    res.status(500).json({ message: 'Failed to fetch data', error });
  }
}
