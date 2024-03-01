# Core Registry Logger

example usage

```javascript
const Logger = require('@chia-carbon/core-registry-logger');
const logger = new Logger({
  projectName: 'tokenization-engine',
  logLevel: 'info',
  packageVersion: '1.0.0'
});
```

# Log Levels

The following error levels can be used in your project. These can be used in any way you like, but the original design concept is as follows:

`fatal`: Only show fatal errors  
`error`: Shows all errors  
`task_error`: All errors including from async tasks  
`warn`: All errors and warnings  
`info`: Warnings, errors, plus informative messages  
`task`: Similar to info, but includes async tasks  
`debug`: Verbose logging with additional troubleshooting messages  
`trace`: Show all output  
