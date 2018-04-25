# Scout

## Initial Installation

Run `npm install` in the root folder, and also in the `functions` directory to install the required npm packages.

Edit the information in `environment.example.ts` and `environment.prod.example.ts`, and afterwards rename them to `environment.ts` and `environment.prod.ts`.

Change `2018` to the current year in `firestore.rules`.

Change `game-template.json` to reflect current game.

### Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

### Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

### Deploy

Run `firebase deploy` to deploy the project to your firebase application, you might need to do `firebase login` before deployment works.

## Year-to-year Maintenance

For a new season, you will need to change the `year` value in `environment.ts` and `environment.prod.ts` to the current year, and also update the year in `firestore.rules`.

The Match Scouting layout will also need to be updated to reflect the current game in `game-template.json`.


## Creating The Game Template

You can create multiple sections, in normal cases they are Autonomous and Teleop, and unless there is a change to the game, you wont need to edit that.

There is a fields array under each section, which lets you list all of the questions for the game.  Below is an example of a field.

```
{
    "name": "auto_baseline",
    "display_name": "Crossed Baseline?",
    "type": "boolean",
    "value": false,
    "default_value": false,
    "required": true
},
```

Each element has a `name`, `display_name`, `type`, `value`, `default_value`, `required`.

The name is the name that the angular FormControl uses while creating the dynamic form, and should be a single word and unique across the entire game-template.  It's recommended that you should name them `<section>_<name>`, like `auto_baseline`.

The display_name is the the label displayed on the form itself.

The type can be:
- boolean - A checkbox.
- number - A number input box.
- textbox - A large textarea.
- string - A smaller text box.
- list - A dropdown of items.

Some types have special attributes that can be used.

### Number
- num_counter - a boolean of whether or not to display a counter next to the number box.

### List
- values - an array of items for the dropdown.

### Any
- validation_regex - regex for how the input should be validated.

You can see an example of game templates in example-template.json.  This template is from the 2018 game and includes everything from above except for validation_regex. *If validation regex is needed, it is used in `backend.service.ts` in the `getFormGroup()` function.*