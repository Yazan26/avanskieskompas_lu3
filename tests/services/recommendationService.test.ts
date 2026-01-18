import axios from 'axios';
import { getAllModules, fetchRecommendations } from '@/services/recommendationService';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('recommendationService', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getAllModules', () => {
        it('should fetch modules successfully', async () => {
            const modules = [{ id: 1, name: 'Test Module' }];
            mockedAxios.get.mockResolvedValueOnce({ data: modules });

            const result = await getAllModules();

            expect(mockedAxios.get).toHaveBeenCalledWith(expect.stringContaining('/api/recommendations/getmodules'));
            expect(result).toEqual(modules);
        });

        it('should return empty array on error', async () => {
            mockedAxios.get.mockRejectedValueOnce(new Error('Network Error'));

            const result = await getAllModules();

            expect(result).toEqual([]);
        });
    });

    describe('fetchRecommendations', () => {
        it('should fetch recommendations successfully', async () => {
            const recommendations = [{ id: 1, name: 'Recommended' }];
            // The service looks for response.data.recommendations
            mockedAxios.post.mockResolvedValueOnce({ 
                data: { recommendations } 
            });

            const result = await fetchRecommendations('coding');

            expect(mockedAxios.post).toHaveBeenCalledWith(
                expect.stringContaining('/api/recommendations/getrecommend'),
                expect.objectContaining({ interests_text: 'coding' }),
                expect.any(Object)
            );
            expect(result).toEqual(recommendations);
        });
    });
});
