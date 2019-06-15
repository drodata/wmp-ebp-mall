# 触底加载

## REST Controller Configuration

实现触底加载的前提是通过 API 获取具有分页功能的 Collection. 默认的 `customers` endpoint 返回的仅仅是资源 collection, 不带分页信息。

需要对 RESTful 控制器进行简单的配置，如下：

```php
class UserController extends ActiveController
{
  public $modelClass = 'app\models\User';
  public $serializer = [
    'class' => 'yii\rest\Serializer',
    'collectionEnvelope' => 'users', // 关键
  ];
}
```

对 `http://locahost/users` 来说，配置前返回的 JSON 数据大致如下：

```js
{
  "customers": [
    {
      "id": 1,
      ...
    },
    {
      "id": 2,
      ...
    },
    ...
  ],
}
```

配置后的返回数据为：

```js
{
  "customers": [
    {
      "id": 1,
      ...
    },
    {
      "id": 2,
      ...
    },
  ],
  "_links": {
    "self": {
      "href": "https://api.yalongdiamond.com/customers?page=1"
    },
    "next": {
      "href": "https://api.yalongdiamond.com/customers?page=2"
    },
    "last": {
      "href": "https://api.yalongdiamond.com/customers?page=85"
    }
  },
  "_meta": {
    "totalCount": 1699,
    "pageCount": 85,
    "currentPage": 1,
    "perPage": 20
  }
}
```

注意多了 `_links` 和 `_meta` 两个对象。`_links` 对小程序来说没有意义，因为小程序不能直接调用 API 请求，必须先到业务服务器，再有业务服务器发起 API 请求。

`_meta` 对象可以用来生成获取下一页数据的请求地址。其中的逻辑很简单：`currentPage < pageCount` 即表示还可以加载数据。
