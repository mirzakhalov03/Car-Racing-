import { api } from "./index";

export interface CarType {
  name: string;
  color: string;
  id: number;
}

export const carsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCars: builder.query<{ cars: CarType[]; totalCount: number }, { page: number; limit: number }>(
      {
        query: ({ page, limit }) => ({
          url: `/garage`,
          params: { _page: page, _limit: limit },
        }),
        transformResponse: (response: CarType[], meta) => {
          return {
            cars: response,
            totalCount: Number(meta?.response?.headers.get("X-Total-Count")) || 0,
          };
        },
      }
    ),
    createCar: builder.mutation<void, Partial<CarType>>({
      query: (newCar) => ({
        url: "/garage",
        method: "POST",
        body: newCar,
      }),
    }),
    updateCar: builder.mutation<void, CarType>({
      query: ({ id, ...rest }) => ({
        url: `/garage/${id}`,
        method: "PUT",
        body: rest,
      }),
    }),
    deleteCar: builder.mutation<void, number>({
      query: (id) => ({
        url: `/garage/${id}`,
        method: "DELETE",
      }),
    }),
    startEngine: builder.mutation({
        query: ({ id, status }) => ({
          url: `/engine`,
          method: "PATCH",
          params: { id, status },
        }),
      }),
  
      stopEngine: builder.mutation({
        query: ({ id }) => ({
          url: `/engine`,
          method: "PATCH",
          params: { id, status: "stopped" },
        }),
      }),
  
      checkDriveStatus: builder.query({
        query: (id) => ({
          url: `/engine`,
          params: { id },
        }),
      }),
      
  }),
});

export const { useGetCarsQuery, useCreateCarMutation, useUpdateCarMutation, useDeleteCarMutation, useStartEngineMutation, useStopEngineMutation, useCheckDriveStatusQuery } = carsApi;
