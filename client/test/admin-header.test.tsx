import { describe, test, vi, expect, beforeEach, afterEach } from 'vitest';
import {render, screen, fireEvent} from '@testing-library/react';

import * as router from 'react-router'

import UserService from '../src/services/UserService';
import { HeaderBar } from '../src/components/header-bar/header-bar';

const navigate = vi.fn();

beforeEach(() => {
    vi.spyOn(router, 'useNavigate')
        .mockImplementation(() => navigate);
})

afterEach(() => {
    vi.clearAllMocks();
    vi.resetAllMocks();
})

describe('Header bar tests', () => {
    test('Admin button should show update with token', () => {
        vi.spyOn(UserService, 'isLoggedIn').mockReturnValue(true);
        vi.spyOn(UserService, 'getLocalUserData').mockReturnValue({
            _id: '',
            isAdmin: true
        });

        render(<HeaderBar />);

        expect(screen.getByText('Admin')).toBeDefined();

        vi.spyOn(UserService, 'isLoggedIn').mockReturnValue(true);
        vi.spyOn(UserService, 'getLocalUserData').mockReturnValue({
            _id: '',
            isAdmin: false
        })
        fireEvent(window, new Event('storage'));

        expect(screen.queryByText('Admin')).toBe(null);
    });

    test('Admin should navigate to /admin', () => {
        vi.spyOn(UserService, 'isLoggedIn').mockReturnValue(true);
        vi.spyOn(UserService, 'getLocalUserData').mockReturnValue({
            _id: '',
            isAdmin: true
        });

        render(<HeaderBar />);
        const button = screen.getByText('Admin');
        expect(button).toBeDefined();
        fireEvent.click(button);

        expect(navigate).toHaveBeenCalledWith('/admin')
    });
})