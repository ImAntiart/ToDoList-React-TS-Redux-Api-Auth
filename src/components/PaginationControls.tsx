import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { setPage, setLimit } from '../store/todoSlice';
import { Box, Pagination, Select, MenuItem, Typography } from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import './PaginationControls.css';

export const PaginationControls = () => {
  const dispatch = useDispatch();
  const page = useSelector((state: RootState) => state.todos.page);
  const limit = useSelector((state: RootState) => state.todos.limit);
  const totalPages = useSelector((state: RootState) => state.todos.totalPages);
  
const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
  dispatch(setPage(value));
};
const handleLimitChange = (event: SelectChangeEvent<number>) => {
  dispatch(setLimit(event.target.value));
  dispatch(setPage(1));
};

  return (
    <div className="pagination-controls-wrapper">
      <div className="input-area pagination-sticker">
        <div className="pagination-content">
          <div className="pagination-label">На странице:</div>
          <Select
            value={limit}
            onChange={handleLimitChange}
            size="small"
            className="limit-select"
            sx={{
              fontFamily: 'var(--font-main)',
              fontSize: '0.95rem',
              minWidth: 80,
              height: '32px',
              '& .MuiSelect-select': {
                py: 0.5,
                px: 1,
              },
            }}
          >
            <MenuItem value={1}>1</MenuItem>
            <MenuItem value={2}>2</MenuItem>
            <MenuItem value={3}>3</MenuItem>
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={20}>20</MenuItem>
          </Select>
        </div>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 0.5,
            mt: 1,
            fontFamily: 'var(--font-main)',
            fontSize: '0.9rem',
            color: 'var(--note-text-main)',
          }}
        >
          <Typography component="div" fontSize="0.9rem">
            Страница {page} из {totalPages || 1}
          </Typography>
          <Pagination
            count={totalPages || 1}
            page={page}
            onChange={handlePageChange}
            color="primary"
            size="small"
            sx={{
              '& .MuiPaginationItem-root': {
                fontFamily: 'var(--font-main)',
                fontSize: '0.8rem',
                borderRadius: 0,
                border: '1px solid var(--note-border)',
                margin: '0 1px',
                backgroundColor: 'var(--note-bg)',
                color: 'var(--note-text-main)',
                '&.Mui-selected': {
                  backgroundColor: 'var(--note-button-bg)',
                  color: 'var(--note-button-text)',
                  border: '1px solid var(--note-button-border)',
                },
                '&:hover': {
                  backgroundColor: 'var(--note-button-bg)',
                  opacity: 0.8,
                },
              },
            }}
          />
        </Box>
      </div>
    </div>
  );
};