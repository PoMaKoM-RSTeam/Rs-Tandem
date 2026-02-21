# TNDM UI Kit

A library of reusable, high-performance UI components for the TNDM project. Built with **Angular Signals** and **OnPush** strategy.

---

## Table of Contents

- [Form Components](#form-components)
  - [General Principles](#general-principles)
  - [TndmInputComponent](#tndminputcomponent)
  - [TndmCheckboxComponent](#tndmcheckboxcomponent)
- [Action Components](#action-components)
  - [TndmButtonComponent](#tndmbuttoncomponent)
- [Shared Types](#shared-types)

---

## Form Components

### Form Integration Example

The UI Kit components are designed to work together within a single `FormGroup`. Use standard Angular Reactive Forms features like `Validators.requiredTrue` for checkboxes or custom `Validators` for inputs.

### Usage in a Component

```typescript
// app.component.ts
protected profileForm = new FormGroup({
  userName: new FormControl('', [Validators.required, Validators.minLength(4)]),
  email: new FormControl('', [Validators.email]),
  agreeToTerms: new FormControl(false, [Validators.requiredTrue]) // Must be true to pass
});
```

### Usage in Template

```html
<form [formGroup]="profileForm" (ngSubmit)="save()">
  <tndm-input-component formControlName="userName" id="user" name="username" label="User Account">
  </tndm-input-component>

  <tndm-checkbox-component
    formControlName="agreeToTerms"
    id="terms"
    name="terms"
    label="I accept the terms and conditions">
  </tndm-checkbox-component>

  <!-- Button automatically reacts to form status -->
  <tndm-button-component
    [btnConfig]="{ 
      label: 'Submit Profile', 
      isDisabled: profileForm.invalid || profileForm.pending 
    }"
    type="submit">
  </tndm-button-component>
</form>
```

### TndmInputComponent

A versatile text field supporting various HTML5 input types and validation states.

#### Validation Priority

Error messages are resolved in the following order:

1. **Custom Message** — from `errorMessages` input
2. **Default Message** — fallback from `DEFAULT_ERROR_MESSAGES` constant

#### Visual States

| Default                                                | With Icon                                                | Focus/Hover                                                | Error State                                               | Disabled                                                |
| :----------------------------------------------------- | :------------------------------------------------------- | :--------------------------------------------------------- | :-------------------------------------------------------- | :------------------------------------------------------ |
| <img src="./docs/input/input-default.png" width="180"> | <img src="./docs/input/input-with-icon.png" width="180"> | <img src="./docs/input/input-focus-hover.png" width="180"> | <img src="./docs/input/input-with-error.png" width="180"> | <img src="./docs/input/input-disabled.png" width="180"> |

#### API (Inputs)

| Property        | Type                         | Required | Default | Description                                   |
| --------------- | ---------------------------- | -------- | ------- | --------------------------------------------- |
| `id`            | `string`                     | ✅       | —       | Unique identifier for label/input binding     |
| `name`          | `string`                     | ✅       | —       | Field name used for generating error messages |
| `label`         | `string`                     | ❌       | `null`  | Text label displayed above the input          |
| `type`          | [`InputType`](#shared-types) | ❌       | `text`  | HTML input type (email, password, etc.)       |
| `placeholder`   | `string`                     | ❌       | `null`  | Ghost text displayed inside the field         |
| `icon`          | [`IconType`](#shared-types)  | ❌       | `null`  | Icon name from the internal library           |
| `errorMessages` | `Record<string, string>`     | ❌       | `{}`    | Custom error message overrides                |

#### Usage

```html
<tndm-input-component
  formControlName="email"
  id="user-email"
  name="email"
  type="email"
  icon="email"
  [errorMessages]="{ required: 'email is mandatory' }">
</tndm-input-component>
```

### TndmCheckboxComponent

A custom-styled checkbox built for boolean state management and seamless Reactive Forms integration.

#### Visual States

| Default                                                      | Checked                                                      | Hover/Active                                               | Disabled                                                      |
| :----------------------------------------------------------- | :----------------------------------------------------------- | :--------------------------------------------------------- | :------------------------------------------------------------ |
| <img src="./docs/checkbox/checkbox-default.png" width="180"> | <img src="./docs/checkbox/checkbox-checked.png" width="180"> | <img src="./docs/checkbox/checkbox-hover.png" width="180"> | <img src="./docs/checkbox/checkbox-disabled.png" width="180"> |

#### API (Inputs)

| Property | Type     | Required | Default | Description                                      |
| :------- | :------- | :------: | :-----: | :----------------------------------------------- |
| `id`     | `string` |    ✅    |    —    | Unique identifier for label and checkbox binding |
| `name`   | `string` |    ✅    |    —    | Field name used for form identification          |
| `label`  | `string` |    ❌    | `null`  | Text label displayed next to the checkbox        |

#### Usage

```html
<tndm-checkbox-component
  formControlName="rememberMe"
  id="remember-me"
  name="remember"
  label="Remember me on this device">
</tndm-checkbox-component>
```

---

## Action Components

### TndmButtonComponent

A high-performance, signal-based button component. It uses strict typing to ensure the button has either a label, an icon, or both, maintaining design consistency across the application.

#### Visual States

| Primary (MD)                                          | Secondary (SM)                                          | With Icon                                          | Hover     | Pressed   | Disabled  |
| :---------------------------------------------------- | :------------------------------------------------------ | :------------------------------------------------- | :-------- | :-------- | :-------- |
| <img src="./docs/button/btn-primary.png" height="70"> | <img src="./docs/button/btn-secondary.png" height="70"> | <img src="./docs/button/btn-icon.png" height="70"> | _Planned_ | _Planned_ | _Planned_ |

#### API (Inputs & Outputs)

| Property    | Type                 | Required | Default | Description                                        |
| :---------- | :------------------- | :------: | :-----: | :------------------------------------------------- |
| `btnConfig` | `ButtonConfig`       |    ✅    |    —    | Configuration object for the button (see below)    |
| `clicked`   | `Output<MouseEvent>` |    ❌    |    —    | Emits native MouseEvent on click (if not disabled) |

#### ButtonConfig Properties

| Property     | Type                        |   Default   | Description                                        |
| :----------- | :-------------------------- | :---------: | :------------------------------------------------- |
| `label`      | `string`                    |      —      | Button text (auto-formatted to Sentence case)      |
| `icon`       | [`IconType`](#shared-types) |      —      | Icon key from the internal `ICONS` library         |
| `variant`    | `'primary' \| 'secondary'`  | `'primary'` | Visual style of the button                         |
| `size`       | `'sm' \| 'md'`              |   `'md'`    | Size dimensions                                    |
| `isDisabled` | `boolean`                   |   `false`   | Disables interaction and applies gray-scale styles |
| `type`       | `'button' \| 'submit'`      | `'button'`  | Standard HTML button type.                         |
| `place`      | `string`                    |      —      | Optional modifier class for specific positioning   |

> **Note:** `ButtonConfig` is a union type. You must provide at least a `label` or an `icon`.

#### Usage

```html
<!-- Primary button with text and icon -->
<tndm-button-component
  [btnConfig]="{
    label: 'get started',
    icon: 'home',
    variant: 'primary',
    size: 'md'
  }"
  (clicked)="onProceed($event)">
</tndm-button-component>

<!-- Small secondary button with icon only -->
<tndm-button-component
  [btnConfig]="{
    icon: 'close',
    variant: 'secondary',
    size: 'sm'
  }">
</tndm-button-component>
```

#### Component Features

- **Label Auto-Formatting**: The component uses a `computed` signal to ensure consistent typography. It automatically converts the `label` to **Sentence case** (e.g., `"GET STARTED"` → `"Get started"`).
- **Smart Click Handling**: The `clicked` output is protected by an internal check. It will **never** emit if `isDisabled` is set to `true`.
- **Form Integration**: When used inside a `<form>`, set the `type` property to `'submit'` in the `btnConfig` to trigger form submission.

#### Integration with Reactive Forms

To disable the button based on form status, bind the `isDisabled` property to the form's state:

```html
<tndm-button-component
  [btnConfig]="{
    label: 'save changes',
    variant: 'primary',
    size: 'md',
    isDisabled: profileForm.invalid || profileForm.pending
  }"
  type="submit">
</tndm-button-component>
```

## Shared Types

**InputType:** `email | password | search | tel | text | url`

**IconType:** `keyof typeof ICONS`

(specific keys from the internal icon library)
