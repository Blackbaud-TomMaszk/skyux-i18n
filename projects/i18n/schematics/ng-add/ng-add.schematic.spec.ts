import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';

import path from 'path';

import { SkyuxVersions } from '../shared/skyux-versions';
import { createTestLibrary } from '../testing/scaffold';

const COLLECTION_PATH = path.resolve(__dirname, '../collection.json');

describe('ng-add.schematic', () => {
  const defaultProjectName = 'my-app';

  let runner: SchematicTestRunner;
  let tree: UnitTestTree;

  beforeEach(async () => {
    runner = new SchematicTestRunner('schematics', COLLECTION_PATH);

    tree = await createTestLibrary(runner, {
      name: defaultProjectName,
    });
  });

  function runSchematic(
    options: { project?: string } = {}
  ): Promise<UnitTestTree> {
    return runner.runSchematicAsync('ng-add', options, tree).toPromise();
  }

  it('should run the NodePackageInstallTask', async () => {
    await runSchematic();

    expect(runner.tasks.some((task) => task.name === 'node-package')).toEqual(
      true
    );
  });

  it('should add dependencies', async () => {
    const updatedTree = await runSchematic();
    const packageJson = JSON.parse(updatedTree.readContent('package.json'));
    expect(packageJson.dependencies).toEqual(
      jasmine.objectContaining({
        '@skyux/assets': SkyuxVersions.Assets,
      })
    );
  });
});
