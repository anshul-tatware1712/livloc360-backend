class BaseRepository {
  constructor(model) {
    this.model = model;
  }

  async create(data) {
    return await this.model.create(data);
  }

  async findById(id, populateOptions = '') {
    return await this.model.findById(id).populate(populateOptions);
  }

  async findByField(field, value, populateOptions = '') {
    const query = { [field]: value };
    return await this.model.findOne(query).populate(populateOptions);
  }

  async find(query = {}, populateOptions = '', options = {}) {
    const { limit, skip, sort, select } = options;
    let queryBuilder = this.model.find(query);

    if (populateOptions) queryBuilder = queryBuilder.populate(populateOptions);
    if (select) queryBuilder = queryBuilder.select(select);
    if (skip) queryBuilder = queryBuilder.skip(skip);
    if (limit) queryBuilder = queryBuilder.limit(limit);
    if (sort) queryBuilder = queryBuilder.sort(sort);

    return await queryBuilder;
  }

  async findOne(query, populateOptions = '') {
    return await this.model.findOne(query).populate(populateOptions);
  }

  async updateById(id, data) {
    return await this.model.findByIdAndUpdate(id, data, { new: true });
  }

  async updateOne(query, data) {
    return await this.model.findOneAndUpdate(query, data, { new: true });
  }

  async deleteById(id) {
    return await this.model.findByIdAndDelete(id);
  }

  async deleteOne(query) {
    return await this.model.findOneAndDelete(query);
  }

  async countDocuments(query = {}) {
    return await this.model.countDocuments(query);
  }

  async aggregate(pipeline) {
    return await this.model.aggregate(pipeline);
  }
}

export default BaseRepository;