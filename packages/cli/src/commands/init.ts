import { GluegunToolbox } from "gluegun";

module.exports = {
  name: "init",
  alias: ["i"],
  description:
    "Create new Shopware PWA project inside the current directory. Can be invoked multiple times for actualisations.",
  run: async (toolbox: GluegunToolbox) => {
    const {
      system: { run },
      print: { info, warning, success, spin }
    } = toolbox;

    if (!toolbox.isProduction) {
      warning(`You're running CLI in development mode!`);
    }

    await toolbox.generateNuxtProject();

    const updateConfigSpinner = spin("Updating configuration");
    // Adding Shopware PWA core dependencies
    try {
      // - unlink potential linked locally packages
      await run(`yarn unlink ${toolbox.coreDependencyPackageNames.join(" ")}`);
    } catch (e) {
      // It's just for safety, unlink on fresh project will throw an error so we can catch it here
    }
    // - add dependencies from npm
    await run(`yarn add ${toolbox.coreDependencyPackageNames.join(" ")}`);
    // for development run - link local packages
    if (!toolbox.isProduction) {
      await run(`yarn link ${toolbox.coreDependencyPackageNames.join(" ")}`);
    }

    await toolbox.removeDefaultNuxtFiles();
    await toolbox.updateNuxtPackageJson();
    await toolbox.updateNuxtConfigFile();
    updateConfigSpinner.succeed();

    const generateFilesSpinner = spin("Generating project files");
    await toolbox.generateTemplateFiles();
    const copyPromisses = toolbox.themeFolders.map(themeFolder =>
      toolbox.copyThemeFolder(themeFolder)
    );
    await Promise.all(copyPromisses);
    generateFilesSpinner.succeed();

    const updateDependenciesSpinner = spin("Updating dependencies");
    // Loading additional packages
    await run(`npx sort-package-json`);
    await run(`yarn`);
    await run(`yarn lint`);
    updateDependenciesSpinner.succeed();

    success(`Generated Shopware PWA project!`);
    info(`Type 'shopware-pwa dev' and start exploring`);
  }
};
