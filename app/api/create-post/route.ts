import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(request: Request) {
  try {
    // Get data from the frontend (if you want dynamic content later)
    const body = await request.json();
    const { title = "Automated Post", content = "Created via Next.js API!" } = body;

    // WordPress site details (replace these with your own)
    const websiteUrl = "https://test1234.shop/"; // Your WP site URL
    const username = "agagahagag958@gmail.com";             // Your WP username
    const appPassword = "i2Db uO3M gXpg GAzP PIwe H6o4"; // Your app password

    // WordPress REST API endpoint
    const apiUrl = `${websiteUrl}/wp-json/wp/v2/posts`;

    // Base64 encode credentials for Basic Auth
    const auth = Buffer.from(`${username}:${appPassword}`).toString("base64");

    // Send request to WordPress API
    const response = await axios.post(
      apiUrl,
      {
        title,
        content,
        status: "publish", // Change to "draft" if you prefer
      },
      {
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/json",
        },
      }
    );

    return NextResponse.json(
      { message: "Post created successfully!", link: response.data.link },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating post:", error.response?.data || error.message);
    return NextResponse.json(
      { error: "Failed to create post", details: error.response?.data || error.message },
      { status: 500 }
    );
  }
}