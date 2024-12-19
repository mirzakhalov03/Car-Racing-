import { api } from "./index";

export const winnersApi = api.injectEndpoints({
  endpoints: (build) => ({
    getWinners: build.query({
      query: ({ _page = 1, _limit = 10, _sort = 'id', _order = 'ASC' }: 
             { _page?: number; _limit?: number; _sort?: string; _order?: 'ASC' | 'DESC' }) => ({
        url: `/winners`,
        params: { _page, _limit, _sort, _order },
      }),
      transformResponse: (response: any, meta: any) => ({
        data: response,
        totalCount: meta?.response?.headers.get('X-Total-Count'),
      }),
      
    }),
    getWinnerById: build.query({
        query: (id: number) => `/winners/${id}`,
      }),

      createWinner: build.mutation<void, { id: number; wins: number; time: number }>({
        query: (newWinner) => ({
          url: "/winners",
          method: "POST",
          body: newWinner,
        }),
      }),
  }),
  
});

export const { useGetWinnersQuery, useGetWinnerByIdQuery, useCreateWinnerMutation } = winnersApi;
