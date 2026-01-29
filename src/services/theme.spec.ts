import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { Theme } from '../types/theme';
import { ThemeService } from './theme';

describe('ThemeService', () => {
    let service: ThemeService;
    let httpMock: HttpTestingController;

    const mockTheme: Theme = {
        mode: 'light',
        colors: {
            primary: '#007bff',
            secondary: '#6c757d',
            background: '#ffffff',
            text: '#212529',
            border: '#dee2e6',
            error: '#dc3545',
            warning: '#ffc107',
            success: '#28a745',
            shadow: '#00000020',
        },
        spacing: {
            xs: 4,
            sm: 8,
            md: 16,
            lg: 24,
            xl: 32,
            xxl: 48,
        },
        fonts: {
            family: 'Arial, sans-serif',
            size: {
                xs: 10,
                sm: 12,
                md: 14,
                lg: 16,
                xl: 20,
                xxl: 24,
            },
            weight: 'normal',
        },
        borders: {
            radius: '4px',
            width: '1px',
            style: 'solid',
        },
        animations: {
            duration: 300,
            easing: 'ease-in-out',
        },
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [ThemeService],
        });
        service = TestBed.inject(ThemeService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
        document.documentElement.style.cssText = '';
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should initialize with undefined theme', () => {
        expect(service.theme).toBeUndefined();
    });

    describe('setCSSVariables', () => {
        it('should set color CSS variables', () => {
            service.setCSSVariables(mockTheme);
            const root = document.documentElement;

            expect(root.style.getPropertyValue('--color-primary')).toBe('#007bff');
            expect(root.style.getPropertyValue('--color-secondary')).toBe('#6c757d');
            expect(root.style.getPropertyValue('--color-background')).toBe('#ffffff');
            expect(root.style.getPropertyValue('--color-text')).toBe('#212529');
            expect(root.style.getPropertyValue('--color-border')).toBe('#dee2e6');
            expect(root.style.getPropertyValue('--color-error')).toBe('#dc3545');
            expect(root.style.getPropertyValue('--color-warning')).toBe('#ffc107');
            expect(root.style.getPropertyValue('--color-success')).toBe('#28a745');
            expect(root.style.getPropertyValue('--color-shadow')).toBe('#00000020');
        });

        it('should set spacing CSS variables', () => {
            service.setCSSVariables(mockTheme);
            const root = document.documentElement;

            expect(root.style.getPropertyValue('--spacing-xs')).toBe('4px');
            expect(root.style.getPropertyValue('--spacing-sm')).toBe('8px');
            expect(root.style.getPropertyValue('--spacing-md')).toBe('16px');
            expect(root.style.getPropertyValue('--spacing-lg')).toBe('24px');
            expect(root.style.getPropertyValue('--spacing-xl')).toBe('32px');
            expect(root.style.getPropertyValue('--spacing-xxl')).toBe('48px');
        });

        it('should set font CSS variables', () => {
            service.setCSSVariables(mockTheme);
            const root = document.documentElement;

            expect(root.style.getPropertyValue('--font-family')).toBe('Arial, sans-serif');
            expect(root.style.getPropertyValue('--font-size-xs')).toBe('10px');
            expect(root.style.getPropertyValue('--font-size-sm')).toBe('12px');
            expect(root.style.getPropertyValue('--font-size-md')).toBe('14px');
            expect(root.style.getPropertyValue('--font-size-lg')).toBe('16px');
            expect(root.style.getPropertyValue('--font-size-xl')).toBe('20px');
            expect(root.style.getPropertyValue('--font-size-xxl')).toBe('24px');
        });

        it('should set border CSS variables', () => {
            service.setCSSVariables(mockTheme);
            const root = document.documentElement;

            expect(root.style.getPropertyValue('--border-radius')).toBe('4px');
            expect(root.style.getPropertyValue('--border-width')).toBe('1px');
            expect(root.style.getPropertyValue('--border-style')).toBe('solid');
        });

        it('should set animation CSS variables', () => {
            service.setCSSVariables(mockTheme);
            const root = document.documentElement;

            expect(root.style.getPropertyValue('--animation-duration')).toBe('300ms');
            expect(root.style.getPropertyValue('--animation-easing')).toBe('ease-in-out');
        });
    });

    describe('setTheme', () => {
        it('should set the theme property', () => {
            service.setTheme(mockTheme);
            expect(service.theme).toEqual(mockTheme);
        });

        it('should call setCSSVariables with the theme', () => {
            vi.spyOn(service, 'setCSSVariables');
            service.setTheme(mockTheme);
            expect(service.setCSSVariables).toHaveBeenCalledWith(mockTheme);
        });

        it('should set CSS variables when setting theme', () => {
            service.setTheme(mockTheme);
            const root = document.documentElement;
            expect(root.style.getPropertyValue('--color-primary')).toBe('#007bff');
            expect(root.style.getPropertyValue('--font-family')).toBe('Arial, sans-serif');
        });
    });

    describe('getTheme', () => {
        it('should return undefined when no theme is set', () => {
            expect(service.getTheme()).toBeUndefined();
        });

        it('should return the current theme', () => {
            service.setTheme(mockTheme);
            expect(service.getTheme()).toEqual(mockTheme);
        });

        it('should return the same theme object reference', () => {
            service.theme = mockTheme;
            expect(service.getTheme()).toBe(mockTheme);
        });
    });

    describe('loadTheme', () => {
        it('should make HTTP GET request to the specified path', () => {
            const path = '/themes/main.json';

            service.loadTheme(path).subscribe();

            const req = httpMock.expectOne(path);
            expect(req.request.method).toBe('GET');
            req.flush(mockTheme);
        });

        it('should return theme data as observable', async () => {
            const path = '/themes/main.json';

            const promise = new Promise<Theme>((resolve) => {
                service.loadTheme(path).subscribe((theme) => {
                    expect(theme).toEqual(mockTheme);
                    resolve(theme);
                });
            });

            const req = httpMock.expectOne(path);
            req.flush(mockTheme);

            await promise;
        });

        it('should handle HTTP errors', async () => {
            const path = '/themes/main.json';
            const errorMessage = 'Theme not found';

            const promise = new Promise<void>((resolve) => {
                service.loadTheme(path).subscribe({
                    next: () => {
                        throw new Error('should have failed with 404 error');
                    },
                    error: (error) => {
                        expect(error.status).toBe(404);
                        resolve();
                    },
                });
            });

            const req = httpMock.expectOne(path);
            req.flush(errorMessage, { status: 404, statusText: 'Not Found' });

            await promise;
        });
    });

    describe('loadAndSetTheme', () => {
        it('should load theme and set it', async () => {
            const path = '/themes/main.json';
            vi.spyOn(service, 'setTheme');

            service.loadAndSetTheme(path);

            const req = httpMock.expectOne(path);
            req.flush(mockTheme);

            await new Promise((resolve) => setTimeout(resolve, 10));
            expect(service.setTheme).toHaveBeenCalledWith(mockTheme);
        });

        it('should set CSS variables after loading theme', async () => {
            const path = '/themes/main.json';

            service.loadAndSetTheme(path);

            const req = httpMock.expectOne(path);
            req.flush(mockTheme);

            await new Promise((resolve) => setTimeout(resolve, 10));
            const root = document.documentElement;
            expect(root.style.getPropertyValue('--color-primary')).toBe('#007bff');
            expect(service.theme).toEqual(mockTheme);
        });

        it('should handle errors gracefully', () => {
            const path = '/themes/main.json';

            // Should not throw error
            expect(() => {
                service.loadAndSetTheme(path);
                const req = httpMock.expectOne(path);
                req.error(new ProgressEvent('error'));
            }).not.toThrow();
        });
    });

    describe('integration tests', () => {
        it('should handle complete theme lifecycle', async () => {
            const path = '/themes/main.json';

            expect(service.getTheme()).toBeUndefined();

            service.loadAndSetTheme(path);

            const req = httpMock.expectOne(path);
            req.flush(mockTheme);

            await new Promise((resolve) => setTimeout(resolve, 10));
            expect(service.getTheme()).toEqual(mockTheme);
            const root = document.documentElement;
            expect(root.style.getPropertyValue('--color-primary')).toBe('#007bff');
            expect(root.style.getPropertyValue('--animation-duration')).toBe('300ms');
        });

        it('should update theme when calling setTheme multiple times', () => {
            service.setTheme(mockTheme);
            expect(service.getTheme()).toEqual(mockTheme);

            const darkTheme: Theme = {
                ...mockTheme,
                mode: 'dark',
                colors: {
                    ...mockTheme.colors,
                    background: '#1a1a1a',
                    text: '#ffffff',
                },
            };

            service.setTheme(darkTheme);
            expect(service.getTheme()).toEqual(darkTheme);
            expect(document.documentElement.style.getPropertyValue('--color-background')).toBe('#1a1a1a');
            expect(document.documentElement.style.getPropertyValue('--color-text')).toBe('#ffffff');
        });
    });
});
