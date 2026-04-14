'use server';
/**
 * @fileOverview Provides personalized restaurant and dish recommendations based on user history and preferences.
 *
 * - receivePersonalizedRecommendations - A function that handles the recommendation process.
 * - ReceivePersonalizedRecommendationsInput - The input type for the receivePersonalizedRecommendations function.
 * - ReceivePersonalizedRecommendationsOutput - The return type for the receivePersonalizedRecommendations function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const PastOrderSchema = z.object({
  restaurantName: z.string().describe('The name of the restaurant from a past order.'),
  dishName: z.string().describe('The name of the dish ordered.'),
  rating: z.number().min(1).max(5).describe('The user-given rating for the dish (1-5).'),
  cuisine: z.string().describe('The cuisine type of the restaurant/dish.'),
  allergens: z.array(z.string()).optional().describe('Optional list of allergens in the dish.'),
});

const RecommendedRestaurantSchema = z.object({
  name: z.string().describe('The name of the recommended restaurant.'),
  cuisine: z.string().describe('The cuisine type of the restaurant.'),
  address: z.string().optional().describe('The address or general location of the restaurant.'),
  rating: z.number().min(1).max(5).optional().describe('An average rating for the restaurant.'),
  reason: z.string().describe('A brief explanation why this restaurant is recommended based on user preferences.'),
});

const RecommendedDishSchema = z.object({
  dishName: z.string().describe('The name of the recommended dish.'),
  restaurantName: z.string().describe('The name of the restaurant where this dish is available.'),
  cuisine: z.string().describe('The cuisine type of the dish.'),
  description: z.string().describe('A brief description of the dish.'),
  reason: z.string().describe('A brief explanation why this dish is recommended based on user preferences.'),
});

const ReceivePersonalizedRecommendationsInputSchema = z.object({
  pastOrders: z.array(PastOrderSchema).describe('A list of the user\u2019s past orders, including details like restaurant, dish, rating, and cuisine.').optional(),
  dietaryPreferences: z.array(z.string()).optional().describe('A list of the user\u2019s dietary preferences (e.g., vegetarian, vegan, gluten-free, halal).'),
  cuisinePreferences: z.array(z.string()).optional().describe('A list of the user\u2019s preferred cuisines (e.g., Italian, Mexican, Japanese).'),
  location: z.string().describe('The user\u2019s current location or preferred area for recommendations.'),
});
export type ReceivePersonalizedRecommendationsInput = z.infer<typeof ReceivePersonalizedRecommendationsInputSchema>;

const ReceivePersonalizedRecommendationsOutputSchema = z.object({
  recommendedRestaurants: z.array(RecommendedRestaurantSchema).describe('A list of recommended restaurants.'),
  recommendedDishes: z.array(RecommendedDishSchema).describe('A list of recommended individual dishes.'),
});
export type ReceivePersonalizedRecommendationsOutput = z.infer<typeof ReceivePersonalizedRecommendationsOutputSchema>;

const recommendationPrompt = ai.definePrompt({
  name: 'recommendationPrompt',
  input: { schema: ReceivePersonalizedRecommendationsInputSchema },
  output: { schema: ReceivePersonalizedRecommendationsOutputSchema },
  prompt: `You are an AI-powered food recommendation system for 'FlavorFind'. Your goal is to provide personalized restaurant and dish recommendations to the user based on their past orders and stated preferences.

Here is the user's information:

Location: {{{location}}}

{{#if pastOrders}}
Past Orders:
{{#each pastOrders}}
- Restaurant: {{{restaurantName}}}, Dish: {{{dishName}}}, Rating: {{{rating}}}/5, Cuisine: {{{cuisine}}}{{#if allergens}}, Allergens: {{#each allergens}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}{{/if}}
{{/each}}
{{else}}
No past orders available.
{{/if}}

{{#if dietaryPreferences}}
Dietary Preferences: {{#each dietaryPreferences}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
{{else}}
No specific dietary preferences stated.
{{/if}}

{{#if cuisinePreferences}}
Cuisine Preferences: {{#each cuisinePreferences}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
{{else}}
No specific cuisine preferences stated.
{{/if}}

Based on the above information, recommend a list of 2-3 restaurants and 2-3 individual dishes that the user would likely enjoy. Prioritize restaurants and dishes that align with their past positive experiences and stated preferences. If no past orders or preferences are available, suggest popular and well-regarded options in their location. Provide a clear reason for each recommendation.`,
});

export async function receivePersonalizedRecommendations(input: ReceivePersonalizedRecommendationsInput): Promise<ReceivePersonalizedRecommendationsOutput> {
  return receivePersonalizedRecommendationsFlow(input);
}

const receivePersonalizedRecommendationsFlow = ai.defineFlow(
  {
    name: 'receivePersonalizedRecommendationsFlow',
    inputSchema: ReceivePersonalizedRecommendationsInputSchema,
    outputSchema: ReceivePersonalizedRecommendationsOutputSchema,
  },
  async (input) => {
    const { output } = await recommendationPrompt(input);
    if (!output) {
      throw new Error('Failed to get personalized recommendations.');
    }
    return output;
  }
);
