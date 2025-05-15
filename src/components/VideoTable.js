import React, { useMemo } from 'react';
import { DataGrid, GridFilterInputValue } from '@mui/x-data-grid';

export default function VideoTable({ rows }) {
  const columns = useMemo(() => [
    {
      field: 'id',
      headerName: 'Video',
      width: 300,
      renderCell: params => (
        <iframe
          title={params.value}
          width="380"
          height="220"
          src={`https://www.youtube.com/embed/${params.value}`}
          frameBorder="0"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ),
      sortingOrder: ['desc', 'asc']
    },
    { 
      field: 'gender_male', 
      headerName: 'Detargeting Score', 
      width: 200,
      filterable: true,
      valueFormatter: ({ value }) => value.toFixed(2),
      sortingOrder: ['desc', 'asc'],
      sortComparator: (v1, v2, param1, param2) => {
        if (v1 !== v2) {
          return v1 < v2 ? -1 : 1;
        }
        // If detargeting scores are equal, sort by impressions
        return param1.api.getCellValue(param1.id, 'impressions') < param2.api.getCellValue(param2.id, 'impressions') ? -1 : 1;
      },
      filterOperators: [
        {
          label: 'Greater than or equal to',
          value: '>=',
          getApplyFilterFn: (filterItem) => {
            if (filterItem.value === undefined || filterItem.value === null || filterItem.value === '') {
              return null;
            }
            return (params) => {
              return Number(params.value) >= Number(filterItem.value);
            };
          },
          InputComponent: GridFilterInputValue,
          InputComponentProps: { type: 'number' }
        },
        {
          label: 'Less than or equal to',
          value: '<=',
          getApplyFilterFn: (filterItem) => {
            if (filterItem.value === undefined || filterItem.value === null || filterItem.value === '') {
              return null;
            }
            return (params) => {
              return Number(params.value) < Number(filterItem.value);
            };
          },
          InputComponent: GridFilterInputValue,
          InputComponentProps: { type: 'number' }
        },
      ],
      type: 'number'
    },
    { 
      field: 'impressions', 
      headerName: 'Impressions', 
      width: 200,
      sortingOrder: ['desc', 'asc']
    },
    { 
      field: 'reason', 
      headerName: 'Reason', 
      width: 400,
      sortingOrder: ['desc', 'asc'],
      renderCell: (params) => (
        <div style={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>
          {params.value}
        </div>
      )
    }
  ], []);

  return (
    <div style={{ height: 700, width: '100%' }}>
      <DataGrid
        rows={rows}
        rowHeight={240}
        columns={columns}
        getRowId={r => r.id}
        pagination
        pageSizeOptions={[10, 25, 50, 100]}
        sortingMode="multiple"
        initialState={{
          pagination: { paginationModel: { pageSize: 25, page: 0 } },
          sorting: {
            sortModel: [
              { field: 'gender_male', sort: 'desc' },
              { field: 'impressions', sort: 'desc' }
            ]
          },
          filter: {
            filterModel: {
              items: [
                {
                  field: 'gender_male',
                  operator: '>=',
                  value: 0.4
                }
              ]
            }
          }
        }}
        disableRowSelectionOnClick
        rowBuffer={5}
        density="compact"
      />
    </div>
  );
}
