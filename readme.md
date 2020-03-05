# vue2-tooltip-simple

A lightweight, JS focused tooltip component for vue2.

## Installing / Getting started

Getting started is dead simple.

```shell
npm install --save vue2-tooltip-simple
```

Inside your component or view:

```shell
import Tooltip from 'vue2-tooltip-simple'
```

After installing and importing the package into your component, it is very simple to use.
Simply pass in the ID of the element you would like to mount the tooltip to, and
pass in the element you would like to show inside the tooltip as a slot.

```shell
// inside your component
<template>
  <div>
    <Tooltip
      :elementId="'my-div'"
      :mode="'hover'"
      :classes="'warning'"
    >
      <template v-slot:content>
        <p>This is the text I want to show on hover</p>
      </template>
    </Tooltip>

    <div id="my-div">
      <p>This is the element I want the tooltip to show over when I hover!</p>
    </div>
  </div>
</template>

<script>
import Tooltip from 'vue2-tooltip-simple'
export default {
  ...
  components: {
    ...
    Tooltip,
    ...
  }
}
</script>
```

This would result in:
![gif](https://i.imgur.com/N4BdJux.gif)

## Options

| Prop      | Required | Type   | Default   | Details                                                                                                                                                                                                                                                                      |
| --------- | -------- | ------ | --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| elementId | true     | String |           | The element that the tooltip will mount to                                                                                                                                                                                                                                   |
| classes   | false    | String | 'primary' | The style of the tooltip. Options are 'primary', 'info', 'warning', 'error'                                                                                                                                                                                                  |
| mode      | false    | String | 'hover'   | The behavior of the tooltip. Options are 'hover', 'click'. 'hover' will detect when the cursor enters the bounding box of the element the tooltip is mounted to, and will follow the cursor. 'click' will only show on click, and position itself above the mounted element. |
