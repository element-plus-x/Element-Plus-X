---
title: useRecord
---

# useRecord 🌴

## Introduction

This is a hook function that automatically calls the browser's built-in API for speech-to-text conversion, allowing users to quickly use speech-to-text functionality, and returns events like start, end, error, and loading state. It's convenient for developers to integrate and implement custom voice button styles.

Combining the `sender` input box and useRecord hook function, you can easily implement custom voice button styles.

## Code Examples

<demo src="./demos/use.vue"></demo>

## config Configuration

| Parameter | Description                        | Type                                      |
| --------- | ---------------------------------- | ----------------------------------------- |
| onEnd     | Callback function when speech ends | `(res: speech conversion result) => void` |

## Returned Hooks

| Property | Description                           | Type                         |
| -------- | ------------------------------------- | ---------------------------- |
| start    | Trigger start speech                  | `(event:MouseEvent) => void` |
| stop     | Trigger stop speech                   | `(event:MouseEvent) => void` |
| loading  | Whether currently speaking            | `boolean`                    |
| value    | Real-time text from speech conversion | `string`                     |
