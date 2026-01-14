import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { RecommendationWizardV2 } from '@/components/recommendations/RecommendationWizardV2';
import { fetchRecommendations } from '@/services/recommendationService';

// Mock the service
jest.mock('@/services/recommendationService', () => ({
    fetchRecommendations: jest.fn(),
}));

// Mock framer-motion
jest.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }: React.PropsWithChildren<unknown>) => <div {...props}>{children}</div>,
        button: ({ children, ...props }: React.PropsWithChildren<unknown>) => <button {...props}>{children}</button>,
        aside: ({ children, ...props }: React.PropsWithChildren<unknown>) => <aside {...props}>{children}</aside>,
    },
    AnimatePresence: ({ children }: React.PropsWithChildren<unknown>) => <>{children}</>,
}));

describe('RecommendationWizardV2', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('completes the wizard flow', async () => {
        const mockModule = {
            id: 1,
            name: 'Mock Module',
            description: 'Desc',
            explanation: ['AI', 'Coding'],
            final_score: 0.95,
            location: 'Breda'
        };

        (fetchRecommendations as jest.Mock).mockResolvedValue({
            recommendations: [mockModule]
        });

        render(<RecommendationWizardV2 />);

        // Step 0: Intro
        expect(screen.getByText(/Vind jouw/i)).toBeInTheDocument();
        const startBtn = screen.getByRole('button', { name: /Start de Wizard/i });
        fireEvent.click(startBtn);

        // Step 1: Interests
        await waitFor(() => expect(screen.getByText(/Waar ligt je passie?/i)).toBeInTheDocument());
        const textarea = screen.getByPlaceholderText(/Ik hou van programmeren/i);
        fireEvent.change(textarea, { target: { value: 'Ik wil graag leren programmeren en met AI werken.' } });
        
        // Wait for state update - Next button enabled
        const nextBtn1 = screen.getByRole('button', { name: /Volgende/i });
        expect(nextBtn1).not.toBeDisabled();
        fireEvent.click(nextBtn1);

        // Step 2: Location
        await waitFor(() => expect(screen.getByText(/Kies je campus/i)).toBeInTheDocument());
        const locBtn = screen.getByText(/Breda/i);
        fireEvent.click(locBtn);
        
        const nextBtn2 = screen.getByRole('button', { name: /Volgende/i });
        fireEvent.click(nextBtn2);

        // Step 3: Filters
        await waitFor(() => expect(screen.getByText(/Jouw voorkeuren/i)).toBeInTheDocument());
        const nextBtn3 = screen.getByRole('button', { name: /Volgende/i });
        fireEvent.click(nextBtn3);

        // Step 4: Tags
        await waitFor(() => expect(screen.getByText(/Finishing Touch/i)).toBeInTheDocument());
        const searchBtn = screen.getByRole('button', { name: /Vind mijn matchs/i });
        fireEvent.click(searchBtn);

        // Step 5: Results (implicit, check fetch call)
        await waitFor(() => {
            expect(fetchRecommendations).toHaveBeenCalledTimes(1);
            expect(fetchRecommendations).toHaveBeenCalledWith(
                'Ik wil graag leren programmeren en met AI werken.',
                'breda', 
                0, 
                5, 
                [], 
                expect.any(Object)
            );
        });
    });
});
