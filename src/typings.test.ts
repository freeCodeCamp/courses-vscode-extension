import { FlashTypes, Flash, Course, Courses, Config } from './typings';

describe('Typings', () => {
  describe('FlashTypes', () => {
    it('should have correct enum values', () => {
      expect(FlashTypes.ERROR).toBe('error');
      expect(FlashTypes.INFO).toBe('info');
      expect(FlashTypes.WARNING).toBe('warning');
    });
  });

  describe('Flash', () => {
    it('should be able to create a Flash object with required properties', () => {
      const flash: Flash = {
        message: 'Test message',
        type: FlashTypes.INFO,
      };
      
      expect(flash.message).toBe('Test message');
      expect(flash.type).toBe(FlashTypes.INFO);
      expect(flash.opts).toBeUndefined();
    });

    it('should be able to create a Flash object with optional properties', () => {
      const flash: Flash = {
        message: 'Test message with options',
        opts: {
          detail: 'Detailed information',
          modal: true,
        },
        type: FlashTypes.WARNING,
      };
      
      expect(flash.message).toBe('Test message with options');
      expect(flash.opts).toBeDefined();
      expect(flash.opts?.detail).toBe('Detailed information');
      expect(flash.opts?.modal).toBe(true);
      expect(flash.type).toBe(FlashTypes.WARNING);
    });
  });

  describe('Course', () => {
    it('should be able to create a Course object', () => {
      const course: Course = {
        githubLink: 'https://github.com/example/course',
        name: 'Example Course',
        tags: ['typescript', 'testing', 'jest'],
      };
      
      expect(course.githubLink).toBe('https://github.com/example/course');
      expect(course.name).toBe('Example Course');
      expect(course.tags).toEqual(['typescript', 'testing', 'jest']);
    });
  });

  describe('Courses', () => {
    it('should be able to create a Courses object', () => {
      const courses: Courses = {
        courses: [
          {
            githubLink: 'https://github.com/example/course1',
            name: 'Course 1',
            tags: ['tag1', 'tag2'],
          },
          {
            githubLink: 'https://github.com/example/course2',
            name: 'Course 2',
            tags: ['tag3', 'tag4'],
          },
        ],
      };
      
      expect(courses.courses).toHaveLength(2);
      expect(courses.courses[0].name).toBe('Course 1');
      expect(courses.courses[1].name).toBe('Course 2');
    });
  });


  describe('Config', () => {
    it('should be able to create a Config object with all properties', () => {
      const config: Config = {
        autoStart: true,
        path: '/workspace/path',
        prepare: 'npm install',
        scripts: {
          'develop-course': 'npm run dev',
          'run-course': 'npm start',
        },
        workspace: {
          files: [
            { path: '/file1.txt' },
            { path: '/file2.txt' },
          ],
          previews: [
            {
              open: true,
              showLoader: false,
              url: 'http://localhost:3000',
              timeout: 5000,
            },
          ],
          terminals: [
            {
              directory: '/workspace',
              message: 'Terminal message',
              name: 'terminal1',
              show: true,
            },
          ],
        },
      };
      
      expect(config.autoStart).toBe(true);
      expect(config.path).toBe('/workspace/path');
      expect(config.prepare).toBe('npm install');
      expect(config.scripts['develop-course']).toBe('npm run dev');
      expect(config.scripts['run-course']).toBe('npm start');
      expect(config.workspace.files).toHaveLength(2);
      expect(config.workspace.files[0].path).toBe('/file1.txt');
      expect(config.workspace.previews).toHaveLength(1);
      expect(config.workspace.previews[0].open).toBe(true);
      expect(config.workspace.terminals).toHaveLength(1);
      expect(config.workspace.terminals[0].name).toBe('terminal1');
    });

    it('should be able to create a minimal Config object', () => {
      const config: Config = {
        autoStart: false,
        path: '',
        prepare: '',
        scripts: {
          'develop-course': '',
          'run-course': '',
        },
        workspace: {
          files: [],
          previews: [],
          terminals: [],
        },
      };
      
      expect(config.autoStart).toBe(false);
      expect(config.path).toBe('');
      expect(config.workspace.files).toHaveLength(0);
      expect(config.workspace.previews).toHaveLength(0);
      expect(config.workspace.terminals).toHaveLength(0);
    });
  });
});