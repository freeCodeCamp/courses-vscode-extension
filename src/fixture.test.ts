import { exampleConfig } from './fixture';
import { Config } from './typings';

describe('fixture.ts', () => {
  describe('exampleConfig', () => {
    it('should be defined', () => {
      expect(exampleConfig).toBeDefined();
    });

    it('should match the expected Config structure', () => {
      const expectedConfig: Config = {
        autoStart: false,
        path: '.freeCodeCamp',
        prepare: 'cp sample.env .env && source ./tooling/.bashrc && npm ci',
        scripts: {
          'develop-course': 'npm run develop',
          'run-course': 'npm run start',
        },
        workspace: {
          files: [
            {
              path: 'README.md',
            },
          ],
          previews: [
            {
              open: true,
              showLoader: true,
              url: 'https://www.freecodecamp.org/',
              timeout: 10000,
            },
          ],
          terminals: [
            {
              directory: '.',
              message: "'Hello World!'",
              name: 'Camper',
              show: true,
            },
          ],
        },
      };

      expect(exampleConfig).toEqual(expectedConfig);
    });

    it('should have autoStart set to false', () => {
      expect(exampleConfig.autoStart).toBe(false);
    });

    it('should have the correct path', () => {
      expect(exampleConfig.path).toBe('.freeCodeCamp');
    });

    it('should have the correct prepare command', () => {
      expect(exampleConfig.prepare).toBe('cp sample.env .env && source ./tooling/.bashrc && npm ci');
    });

    describe('scripts', () => {
      it('should have develop-course script', () => {
        expect(exampleConfig.scripts).toHaveProperty('develop-course');
        expect(exampleConfig.scripts['develop-course']).toBe('npm run develop');
      });

      it('should have run-course script', () => {
        expect(exampleConfig.scripts).toHaveProperty('run-course');
        expect(exampleConfig.scripts['run-course']).toBe('npm run start');
      });
    });

    describe('workspace', () => {
      describe('files', () => {
        it('should have one file with correct path', () => {
          expect(exampleConfig.workspace.files).toHaveLength(1);
          expect(exampleConfig.workspace.files[0]).toEqual({ path: 'README.md' });
        });
      });

      describe('previews', () => {
        it('should have one preview with correct settings', () => {
          expect(exampleConfig.workspace.previews).toHaveLength(1);
          expect(exampleConfig.workspace.previews[0]).toEqual({
            open: true,
            showLoader: true,
            url: 'https://www.freecodecamp.org/',
            timeout: 10000,
          });
        });
      });

      describe('terminals', () => {
        it('should have one terminal with correct settings', () => {
          expect(exampleConfig.workspace.terminals).toHaveLength(1);
          expect(exampleConfig.workspace.terminals[0]).toEqual({
            directory: '.',
            message: "'Hello World!'",
            name: 'Camper',
            show: true,
          });
        });
      });
    });
  });
});