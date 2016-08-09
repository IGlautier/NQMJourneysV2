# nqm-app-minimal
minimal nqm app with tdx authentication

## usage
Use the ensureAuthenticated middleware helper on any route that requires protection. 

### Sensitive data
Require authentication before showing sensitive page.

```
app.get("/secretData", ensureAuthenticated, function(req, res) {
  res.render("secretDataView");
});
```

### Public
Don't care about authentication for public views, so omit ensureAuthenticated middleware.

```
app.get("/publicData", function(req, res) {
  res.render("publicDataView");
});
```
