# timeslot-picker/time-range picker html control

## Usage
```
<!--jQuery-->
<input type="text" starting-time='{"from": 8, "to": 23}' time-slots='[{"from": "12:00", "to": "23:00"}]' id="action_qty" onfocus="ShowTimeRangePicker(this)" />

<!--HTML5 + AngularJS-->
<timeslot-picker id="myTimeslotPicker" starting-time="{from: 8, to: 23}" time-slots="[{from: '12:00', to: '23:00'}]" on-timeslot-changed="handleTimeslotChanged"></timeslot-picker>
```
Parameters:
starting-time: overall time slot limit
time-slots: time slots which are valid, if selected time range is within the required time slot then the bar will become green otherwise it will be red

### validations
    1. if selected time slot is not within the specified valid time slot then control becomes red
    2. if selected time slot is within the specified valid time slot then control becomes green

## Demo
[click here](http://nitinsawant.com/timeslot-picker/demo.html)

## Roadmap:
| No | Feature      | status |
|----|---------------------------|---|
| 1. | set starting from & to time      | ✅ |
| 2. | set valid from & to time | ✅ |
| 3. | select single time slot from specified start time and end time             | ✅ |
| 4. | draggable component  | ✅ |
| 5. | timeslot validations  | ✅ |
| 6. | [angularjs implementation](https://github.com/nitinjs/timeslot-picker/blob/master/App/Main/Directives/timeslotPicker.js)  | ✅ |
| 7. | [jQuery implementation](https://github.com/nitinjs/timeslot-picker/blob/master/demo.html)  | ✅ |
| 8. | Close button for the picker          | 🚧 |
| 9. | Angular2 version          | 🚧 |


made with 🧡 in mumbai
