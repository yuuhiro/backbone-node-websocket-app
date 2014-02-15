this["YUU"] = this["YUU"] || {};
this["YUU"]["Templates"] = this["YUU"]["Templates"] || {};

this["YUU"]["Templates"]["memoItem"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, stack2, functionType="function";


  buffer += "<div class=\"message_wrap\">\n<button class=\"delete\">\n<span class=\"icon\">&#10060;</span>\n</button>\n<time datetime=\"";
  if (stack1 = helpers.date) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.date; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\">\n";
  stack2 = ((stack1 = ((stack1 = depth0.newDate),stack1 == null || stack1 === false ? stack1 : stack1.year)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1);
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += ".";
  stack2 = ((stack1 = ((stack1 = depth0.newDate),stack1 == null || stack1 === false ? stack1 : stack1.month)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1);
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += ".";
  stack2 = ((stack1 = ((stack1 = depth0.newDate),stack1 == null || stack1 === false ? stack1 : stack1.day)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1);
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n<span class=\"time\">";
  stack2 = ((stack1 = ((stack1 = depth0.newDate),stack1 == null || stack1 === false ? stack1 : stack1.hour)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1);
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += ":";
  stack2 = ((stack1 = ((stack1 = depth0.newDate),stack1 == null || stack1 === false ? stack1 : stack1.minute)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1);
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "</span>\n</time>\n<p class=\"message\">";
  if (stack2 = helpers.message) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.message; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "</p>\n<textarea class=\"edit_form\">";
  if (stack2 = helpers.form_message) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.form_message; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "</textarea>\n</div>";
  return buffer;
  });