import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
    constructor(private readonly searchService: SearchService) {}

    @Get()
    async search(
      @Query('q') query: string,
      @Query('filter') filter: string,
    ) {
      if (!query) return [];  // If there's no query, return an empty array
    
      try {
        const results = await this.searchService.search(query, filter);
        console.log('Results from service:', results); // Log to verify
        return results;
      } catch (error) {
        console.error('Error in search:', error); // Log any errors
        return []; // Return an empty array in case of error
      }
    }
    
}
